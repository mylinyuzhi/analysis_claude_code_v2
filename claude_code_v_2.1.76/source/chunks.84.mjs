
// @from(Ln 217943, Col 0)
class R14 {
    cache;
    constructor(A, q) {
        this.cache = new kT({
            max: A,
            maxSize: q,
            sizeCalculation: (K) => Math.max(1, Buffer.byteLength(K.content))
        })
    }
    get(A) {
        return this.cache.get(ED1(A))
    }
    set(A, q) {
        return this.cache.set(ED1(A), q), this
    }
    has(A) {
        return this.cache.has(ED1(A))
    }
    delete(A) {
        return this.cache.delete(ED1(A))
    }
    clear() {
        this.cache.clear()
    }
    get size() {
        return this.cache.size
    }
    get max() {
        return this.cache.max
    }
    get maxSize() {
        return this.cache.maxSize
    }
    get calculatedSize() {
        return this.cache.calculatedSize
    }
    keys() {
        return this.cache.keys()
    }
    entries() {
        return this.cache.entries()
    }
    dump() {
        return this.cache.dump()
    }
    load(A) {
        this.cache.load(A)
    }
}
// @from(Ln 217993, Col 0)
function yd(A, q = yv9) {
    return new R14(A, q)
}
// @from(Ln 217997, Col 0)
function mf8(A) {
    return Object.fromEntries(A.entries())
}
// @from(Ln 218001, Col 0)
function jB(A) {
    return Array.from(A.keys())
}
// @from(Ln 218005, Col 0)
function DI(A) {
    let q = yd(A.max, A.maxSize);
    return q.load(A.dump()), q
}
// @from(Ln 218010, Col 0)
function yD1(A, q) {
    let K = DI(A);
    for (let [Y, z] of q.entries()) {
        let _ = K.get(Y);
        if (!_ || z.timestamp > _.timestamp) K.set(Y, z)
    }
    return K
}
// @from(Ln 218018, Col 4)
Ed = 100
// @from(Ln 218019, Col 4)
yv9 = 26214400
// @from(Ln 218020, Col 4)
tP = E(() => {
    I$6()
})
// @from(Ln 218024, Col 0)
function S14(A) {
    if (typeof A !== "string") return;
    return h14.find((q) => q === A)
}
// @from(Ln 218028, Col 4)
h14
// @from(Ln 218028, Col 9)
LD1
// @from(Ln 218028, Col 14)
RD1
// @from(Ln 218028, Col 19)
_36
// @from(Ln 218028, Col 24)
w36
// @from(Ln 218029, Col 4)
jF6 = E(() => {
    h14 = ["user", "feedback", "project", "reference"];
    LD1 = ["## Types of memory", "", "There are several discrete types of memory that you can store in your memory system. Each type below declares a <scope> of `private`, `team`, or guidance for choosing between the two.", "", "<types>", "<type>", "    <name>user</name>", "    <scope>always private</scope>", "    <description>Contain information about the user's role, goals, responsibilities, and knowledge. Great user memories help you tailor your future behavior to the user's preferences and perspective. Your goal in reading and writing these memories is to build up an understanding of who the user is and how you can be most helpful to them specifically. For example, you should collaborate with a senior software engineer differently than a student who is coding for the very first time. Keep in mind, that the aim here is to be helpful to the user. Avoid writing memories about the user that could be viewed as a negative judgement or that are not relevant to the work you're trying to accomplish together.</description>", "    <when_to_save>When you learn any details about the user's role, preferences, responsibilities, or knowledge</when_to_save>", "    <how_to_use>When your work should be informed by the user's profile or perspective. For example, if the user is asking you to explain a part of the code, you should answer that question in a way that is tailored to the specific details that they will find most valuable or that helps them build their mental model in relation to domain knowledge they already have.</how_to_use>", "    <examples>", "    user: I'm a data scientist investigating what logging we have in place", "    assistant: [saves private user memory: user is a data scientist, currently focused on observability/logging]", "", "    user: I've been writing Go for ten years but this is my first time touching the React side of this repo", "    assistant: [saves private user memory: deep Go expertise, new to React and this project's frontend — frame frontend explanations in terms of backend analogues]", "    </examples>", "</type>", "<type>", "    <name>feedback</name>", "    <scope>default to private. Save as team only when the correction is clearly a project-wide convention that every contributor should follow (e.g., a testing policy, a build invariant), not a personal style preference.</scope>", "    <description>Guidance or correction the user has given you. These are a very important type of memory to read and write as they allow you to remain coherent and responsive to the way you should approach work in the project. Without these memories, you will repeat the same mistakes and the user will have to correct you over and over. Before saving a private feedback memory, check that it doesn't contradict a team feedback memory — if it does, either don't save it or note the override explicitly.</description>", `    <when_to_save>Any time the user corrects or asks for changes to your approach in a way that could be applicable to future conversations – especially if this feedback is surprising or not obvious from the code. These often take the form of "no not that, instead do...", "lets not...", "don't...". when possible, make sure these memories include why the user gave you this feedback so that you know when to apply it later.</when_to_save>`, "    <how_to_use>Let these memories guide your behavior so that the user and other users in the project do not need to offer the same guidance twice.</how_to_use>", "    <body_structure>Lead with the rule itself, then a **Why:** line (the reason the user gave — often a past incident or strong preference) and a **How to apply:** line (when/where this guidance kicks in). Knowing *why* lets you judge edge cases instead of blindly following the rule.</body_structure>", "    <examples>", "    user: don't mock the database in these tests — we got burned last quarter when mocked tests passed but the prod migration failed", "    assistant: [saves team feedback memory: integration tests must hit a real database, not mocks. Reason: prior incident where mock/prod divergence masked a broken migration. Team scope: this is a project testing policy, not a personal preference]", "", "    user: stop summarizing what you just did at the end of every response, I can read the diff", "    assistant: [saves private feedback memory: this user wants terse responses with no trailing summaries. Private because it's a communication preference, not a project convention]", "    </examples>", "</type>", "<type>", "    <name>project</name>", "    <scope>private or team, but strongly bias toward team</scope>", "    <description>Information that you learn about ongoing work, goals, initiatives, bugs, or incidents within the project that is not otherwise derivable from the code or git history. Project memories help you understand the broader context and motivation behind the work users are working on within this working directory.</description>", '    <when_to_save>When you learn who is doing what, why, or by when. These states change relatively quickly so try to keep your understanding of this up to date. Always convert relative dates in user messages to absolute dates when saving (e.g., "Thursday" → "2026-03-05"), so the memory remains interpretable after time passes.</when_to_save>', "    <how_to_use>Use these memories to more fully understand the details and nuance behind the user's request, anticipate coordination issues across users, make better informed suggestions.</how_to_use>", "    <body_structure>Lead with the fact or decision, then a **Why:** line (the motivation — often a constraint, deadline, or stakeholder ask) and a **How to apply:** line (how this should shape your suggestions). Project memories decay fast, so the why helps future-you judge whether the memory is still load-bearing.</body_structure>", "    <examples>", "    user: we're freezing all non-critical merges after Thursday — mobile team is cutting a release branch", "    assistant: [saves team project memory: merge freeze begins 2026-03-05 for mobile release cut. Flag any non-critical PR work scheduled after that date]", "", "    user: the reason we're ripping out the old auth middleware is that legal flagged it for storing session tokens in a way that doesn't meet the new compliance requirements", "    assistant: [saves team project memory: auth middleware rewrite is driven by legal/compliance requirements around session token storage, not tech-debt cleanup — scope decisions should favor compliance over ergonomics]", "    </examples>", "</type>", "<type>", "    <name>reference</name>", "    <scope>usually team</scope>", "    <description>Stores pointers to where information can be found in external systems. These memories allow you to remember where to look to find up-to-date information outside of the project directory.</description>", "    <when_to_save>When you learn about resources in external systems and their purpose. For example, that bugs are tracked in a specific project in Linear or that feedback can be found in a specific Slack channel.</when_to_save>", "    <how_to_use>When the user references an external system or information that may be in an external system.</how_to_use>", "    <examples>", `    user: check the Linear project "INGEST" if you want context on these tickets, that's where we track all pipeline bugs`, '    assistant: [saves team reference memory: pipeline bugs are tracked in Linear project "INGEST"]', "", "    user: the Grafana board at grafana.internal/d/api-latency is what oncall watches — if you're touching request handling, that's the thing that'll page someone", "    assistant: [saves team reference memory: grafana.internal/d/api-latency is the oncall latency dashboard — check it when editing request-path code]", "    </examples>", "</type>", "</types>", ""], RD1 = ["## Types of memory", "", "There are several discrete types of memory that you can store in your memory system:", "", "<types>", "<type>", "    <name>user</name>", "    <description>Contain information about the user's role, goals, responsibilities, and knowledge. Great user memories help you tailor your future behavior to the user's preferences and perspective. Your goal in reading and writing these memories is to build up an understanding of who the user is and how you can be most helpful to them specifically. For example, you should collaborate with a senior software engineer differently than a student who is coding for the very first time. Keep in mind, that the aim here is to be helpful to the user. Avoid writing memories about the user that could be viewed as a negative judgement or that are not relevant to the work you're trying to accomplish together.</description>", "    <when_to_save>When you learn any details about the user's role, preferences, responsibilities, or knowledge</when_to_save>", "    <how_to_use>When your work should be informed by the user's profile or perspective. For example, if the user is asking you to explain a part of the code, you should answer that question in a way that is tailored to the specific details that they will find most valuable or that helps them build their mental model in relation to domain knowledge they already have.</how_to_use>", "    <examples>", "    user: I'm a data scientist investigating what logging we have in place", "    assistant: [saves user memory: user is a data scientist, currently focused on observability/logging]", "", "    user: I've been writing Go for ten years but this is my first time touching the React side of this repo", "    assistant: [saves user memory: deep Go expertise, new to React and this project's frontend — frame frontend explanations in terms of backend analogues]", "    </examples>", "</type>", "<type>", "    <name>feedback</name>", "    <description>Guidance or correction the user has given you. These are a very important type of memory to read and write as they allow you to remain coherent and responsive to the way you should approach work in the project. Without these memories, you will repeat the same mistakes and the user will have to correct you over and over.</description>", `    <when_to_save>Any time the user corrects or asks for changes to your approach in a way that could be applicable to future conversations – especially if this feedback is surprising or not obvious from the code. These often take the form of "no not that, instead do...", "lets not...", "don't...". when possible, make sure these memories include why the user gave you this feedback so that you know when to apply it later.</when_to_save>`, "    <how_to_use>Let these memories guide your behavior so that the user does not need to offer the same guidance twice.</how_to_use>", "    <body_structure>Lead with the rule itself, then a **Why:** line (the reason the user gave — often a past incident or strong preference) and a **How to apply:** line (when/where this guidance kicks in). Knowing *why* lets you judge edge cases instead of blindly following the rule.</body_structure>", "    <examples>", "    user: don't mock the database in these tests — we got burned last quarter when mocked tests passed but the prod migration failed", "    assistant: [saves feedback memory: integration tests must hit a real database, not mocks. Reason: prior incident where mock/prod divergence masked a broken migration]", "", "    user: stop summarizing what you just did at the end of every response, I can read the diff", "    assistant: [saves feedback memory: this user wants terse responses with no trailing summaries]", "    </examples>", "</type>", "<type>", "    <name>project</name>", "    <description>Information that you learn about ongoing work, goals, initiatives, bugs, or incidents within the project that is not otherwise derivable from the code or git history. Project memories help you understand the broader context and motivation behind the work the user is doing within this working directory.</description>", '    <when_to_save>When you learn who is doing what, why, or by when. These states change relatively quickly so try to keep your understanding of this up to date. Always convert relative dates in user messages to absolute dates when saving (e.g., "Thursday" → "2026-03-05"), so the memory remains interpretable after time passes.</when_to_save>', "    <how_to_use>Use these memories to more fully understand the details and nuance behind the user's request and make better informed suggestions.</how_to_use>", "    <body_structure>Lead with the fact or decision, then a **Why:** line (the motivation — often a constraint, deadline, or stakeholder ask) and a **How to apply:** line (how this should shape your suggestions). Project memories decay fast, so the why helps future-you judge whether the memory is still load-bearing.</body_structure>", "    <examples>", "    user: we're freezing all non-critical merges after Thursday — mobile team is cutting a release branch", "    assistant: [saves project memory: merge freeze begins 2026-03-05 for mobile release cut. Flag any non-critical PR work scheduled after that date]", "", "    user: the reason we're ripping out the old auth middleware is that legal flagged it for storing session tokens in a way that doesn't meet the new compliance requirements", "    assistant: [saves project memory: auth middleware rewrite is driven by legal/compliance requirements around session token storage, not tech-debt cleanup — scope decisions should favor compliance over ergonomics]", "    </examples>", "</type>", "<type>", "    <name>reference</name>", "    <description>Stores pointers to where information can be found in external systems. These memories allow you to remember where to look to find up-to-date information outside of the project directory.</description>", "    <when_to_save>When you learn about resources in external systems and their purpose. For example, that bugs are tracked in a specific project in Linear or that feedback can be found in a specific Slack channel.</when_to_save>", "    <how_to_use>When the user references an external system or information that may be in an external system.</how_to_use>", "    <examples>", `    user: check the Linear project "INGEST" if you want context on these tickets, that's where we track all pipeline bugs`, '    assistant: [saves reference memory: pipeline bugs are tracked in Linear project "INGEST"]', "", "    user: the Grafana board at grafana.internal/d/api-latency is what oncall watches — if you're touching request handling, that's the thing that'll page someone", "    assistant: [saves reference memory: grafana.internal/d/api-latency is the oncall latency dashboard — check it when editing request-path code]", "    </examples>", "</type>", "</types>", ""], _36 = ["## What NOT to save in memory", "", "- Code patterns, conventions, architecture, file paths, or project structure — these can be derived by reading the current project state.", "- Git history, recent changes, or who-changed-what — `git log` / `git blame` are authoritative.", "- Debugging solutions or fix recipes — the fix is in the code; the commit message has the context.", "- Anything already documented in CLAUDE.md files.", "- Ephemeral task details: in-progress work, temporary state, current conversation context."], w36 = ["```markdown", "---", "name: {{memory name}}", "description: {{one-line description — used to decide relevance in future conversations, so be specific}}", `type: {{${h14.join(", ")}}}`, "---", "", "{{memory content — for feedback/project types, structure as: rule/fact, then **Why:** and **How to apply:** lines}}", "```"]
})
// @from(Ln 218034, Col 0)
function n$() {
    if (!t6(process.env.EMBEDDED_SEARCH_TOOLS)) return !1;
    let A = process.env.CLAUDE_CODE_ENTRYPOINT;
    return A !== "sdk-ts" && A !== "sdk-py" && A !== "sdk-cli"
}
// @from(Ln 218040, Col 0)
function C14() {
    return process.execPath
}
// @from(Ln 218043, Col 4)
XI = E(() => {
    A8()
})
// @from(Ln 218046, Col 4)
Ld = {}
// @from(Ln 218068, Col 0)
function Rv9(A) {
    if (A.includes("\x00")) throw new MX(`Null byte in path key: "${A}"`);
    let q;
    try {
        q = decodeURIComponent(A)
    } catch {
        q = A
    }
    if (q !== A && (q.includes("..") || q.includes("/"))) throw new MX(`URL-encoded traversal in path key: "${A}"`);
    let K = A.normalize("NFKC");
    if (K !== A && (K.includes("..") || K.includes("/") || K.includes("\\") || K.includes("\x00"))) throw new MX(`Unicode-normalized traversal in path key: "${A}"`);
    if (A.includes("\\")) throw new MX(`Backslash in path key: "${A}"`);
    if (A.startsWith("/")) throw new MX(`Absolute path key: "${A}"`);
    return A
}
// @from(Ln 218084, Col 0)
function SD1() {
    if (!Z3()) return !1;
    return w8("tengu_herring_clock", !1)
}
// @from(Ln 218089, Col 0)
function Lk() {
    return (hD1(uH(), "team") + gf8).normalize("NFC")
}
// @from(Ln 218093, Col 0)
function hv9() {
    return hD1(uH(), "team", "MEMORY.md")
}
// @from(Ln 218096, Col 0)
async function x14(A) {
    let q = [],
        K = A;
    for (let Y = I14(K); K !== Y; Y = I14(K)) try {
        let z = await b14(K);
        return q.length === 0 ? z : hD1(z, ...q.reverse())
    } catch (z) {
        let _ = z.code;
        if (_ === "ENOENT") try {
                if ((await Lv9(K)).isSymbolicLink()) throw new MX(`Dangling symlink detected (target does not exist): "${K}"`)
            } catch (w) {
                if (w instanceof MX) throw w
            } else if (_ === "ELOOP") throw new MX(`Symlink loop detected in path: "${K}"`);
            else if (_ !== "ENOTDIR" && _ !== "ENAMETOOLONG") throw new MX(`Cannot verify path containment (${_}): "${K}"`);
        q.push(K.slice(Y.length + gf8.length)), K = Y
    }
    return A
}
// @from(Ln 218114, Col 0)
async function u14(A) {
    let q;
    try {
        q = await b14(Lk().replace(/[/\\]+$/, ""))
    } catch (K) {
        let Y = K.code;
        if (Y === "ENOENT" || Y === "ENOTDIR") return !0;
        return !1
    }
    if (A === q) return !0;
    return A.startsWith(q + gf8)
}
// @from(Ln 218127, Col 0)
function m14(A) {
    let q = Bf8(A),
        K = Lk();
    return q.startsWith(K)
}
// @from(Ln 218132, Col 0)
async function Sv9(A) {
    if (A.includes("\x00")) throw new MX(`Null byte in path: "${A}"`);
    let q = Bf8(A),
        K = Lk();
    if (!q.startsWith(K)) throw new MX(`Path escapes team memory directory: "${A}"`);
    let Y = await x14(q);
    if (!await u14(Y)) throw new MX(`Path escapes team memory directory via symlink: "${A}"`);
    return q
}
// @from(Ln 218141, Col 0)
async function Ff8(A) {
    Rv9(A);
    let q = Lk(),
        K = hD1(q, A),
        Y = Bf8(K);
    if (!Y.startsWith(q)) throw new MX(`Key escapes team memory directory: "${A}"`);
    let z = await x14(Y);
    if (!await u14(z)) throw new MX(`Key escapes team memory directory via symlink: "${A}"`);
    return Y
}
// @from(Ln 218152, Col 0)
function JF6(A) {
    return SD1() && m14(A)
}
// @from(Ln 218155, Col 4)
MX
// @from(Ln 218156, Col 4)
Rk = E(() => {
    mH();
    HA();
    MX = class MX extends Error {
        constructor(A) {
            super(A);
            this.name = "PathTraversalError"
        }
    }
})
// @from(Ln 218166, Col 4)
B14 = {}
// @from(Ln 218173, Col 0)
function Cv9() {
    let A = uH(),
        q = Lk();
    return ["# Memory", "", `You have two persistent memory systems. ${pf8}`, "", `1. **User memory** at \`${A}\` — private between you and the user, persists across your conversations`, `2. **Team memory** at \`${q}\` — shared with all users in the same organization, automatically synced across conversations`, "", "Use these directories to build knowledge over multiple conversations and become a more effective and helpful agent over time. It is very important that you build up context and knowledge in these directories so that the user feels like they can trust you to help with meaningful projects across conversations.", "", "## You MUST access memories when:", "- Specific known memories (personal or team) seem relevant to the task at hand.", "- The user seems to be referring to work you may have done in a prior conversation with them or other users in their organization.", "- The user explicitly asks you to check memory, recall, or remember.", "", "## You MUST save memories when:", "- You encounter information that might be useful in future conversations. Whenever you find new information, think to yourself whether it would be helpful to have if you started a new conversation tomorrow. If the answer is yes, save or update your memory before you continue work on your task.", `- When the user describes what they are working on, their goals, or the broader context of their project (e.g., "I'm building...", "we're migrating to...", "the goal is..."), save this so you can reference it in future sessions.`, '- If a user explicitly asks you to remember a piece of information, you MUST save it before continuing your work. Messages like this will often begin with "never...", "always...", "next time...", "remember..." etc.', "- If a user explicitly asks you to forget or stop remembering information, you MUST find and remove the relevant entry from the appropriate memory.", "- If the user corrects you on something you stated from memory (personal or team), you MUST update or remove the incorrect entry. A correction means the stored memory is wrong — fix it at the source before continuing, so the same mistake does not repeat in future conversations or for other team members.", "- When in doubt about whether something is worth saving, save it — it is better to prune and curate memories later than it is to fail to remember and have users correct you later.", "", "## What to save in user memory (private):", "- User preferences for workflow, tools, or communication style. Especially if the user corrects or guides you during the conversation.", "- Information that might help you understand the user's personal projects and goals.", "- Solutions to problems you have encountered with the current user that are unlikely to recur for other users.", "- Any information the user has explicitly asked you to remember.", "", "## What to save in team memory (shared):", "- Reusable patterns and conventions within the project that are not otherwise documented in the CLAUDE.md files.", "- Project or goal information that might help you understand the intent of future and ongoing work within the user's organization.", "- Architectural decisions, important file paths, and project structure.", "- Solutions to problems that are likely to recur across users or conversations.", "- Insights that may help you with future debugging conversations with all users that might contribute to this project.", "- Any information the user explicitly has asked you to remember for the team or commit to team memory.", "", "## What not to save:", "- You MUST NEVER save secrets, credentials, API keys, tokens, passwords, or other sensitive data in team memory. Team memory syncs to all repository collaborators as plaintext files. Writes containing detected secrets will be automatically rejected.", "- Ephemeral task details: information that is only relevant to the current task at hand like in-progress work or temporary state.", "- User-specific preferences in team memory: Not all new information will be useful to all members of the user's organization. For example, one user might prefer a functional programming style and another might prefer OOP. If you determine that a memory is user-specific, save it to user memory instead.", "- Information that duplicates or contradicts existing CLAUDE.md instructions.", "- Information that you'd like to remember for later on in this conversation. Remember that your conversation will be automatically compressed and so you effectively have an unlimited context for this conversation. It is not necessary or useful to use memory for this purpose.", "", "## Choosing between user memory and team memory:", '- If the user explicitly says "remember" or "save", use user memory.', '- If the user explicitly says "remember for the team" or "save to team memory", use team memory.', "- If the information is about personal preferences, style, or workflow specific to this user, use user memory.", "- If the information is about project conventions, architecture, or shared knowledge, use team memory.", "- If unclear, ask which memory to use.", "", "## How to save memories:", "You should save memory files using this format:", "", "```markdown", "---", "name: {{memory name}}", "description: {{one-line description. This is used to decide if a memory will be useful in future conversations, so try to make your description very specific to the actual content of the memory.}}", "---", "", "{{memory content}}", "```", "", "- Keep the name and description fields of memories up-to-date with the memory content", "- Organize memory semantically by topic, not chronologically", "- Use the Write and Edit tools to update your memory files", `- Each directory has a \`${o2}\` entrypoint loaded into your conversation context — lines after ${uj} will be truncated, so keep them concise`, "- Create separate topic files (e.g., `debugging.md`, `patterns.md`) for detailed notes and link to them from MEMORY.md", "- Update or remove memories that turn out to be wrong or outdated", "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one.", "", "## Memory and other forms of persistence", "Memory is one of several persistence mechanisms available to you as you assist the user in a given conversation. The distinction is often that memory can be recalled in future conversations and should not be used for persisting information that is only useful within the scope of the current conversation.", "- When to use or update a plan instead of memory: If you are about to start a non-trivial implementation task and would like to reach alignment with the user on your approach you should use a Plan rather than saving this information to memory. Similarly, if you already have a plan within the conversation and you have changed your approach persist that change by updating the plan rather than saving a memory.", "- When to use or update tasks instead of memory: When you need to break your work in current conversation into discrete steps or keep track of your progress use tasks instead of saving to memory. Tasks are great for persisting information about the work that needs to be done in the current conversation, but memory should be reserved for information that will be useful in future conversations.", "", ...Dt(A)].join(`
`)
}
// @from(Ln 218180, Col 0)
function Iv9() {
    let A = uH(),
        q = Lk();
    return ["# Memory", "", `You have a persistent, file-based memory system with two directories: a private directory at \`${A}\` and a shared team directory at \`${q}\`. ${pf8}`, "", "You should build up this memory system over time so that future conversations can have a complete picture of who the user is, how they'd like to collaborate with you, what behaviors to avoid or repeat, and the context behind the work the user gives you.", "", "If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.", "", "## Memory scope", "", "There are two scope levels:", "", `- private: memories that are private between you and the current user. They persist across conversations with only this specific user and are stored at the root \`${A}\`.`, `- team: memories that are shared with and contributed by all of the users who work within this project directory. Team memories are synced at the beginning of every session and they are stored at \`${q}\`.`, "", ...LD1, ..._36, "- You MUST avoid saving sensitive data within shared team memories. For example, never save API keys or user credentials.", "", "## How to save memories", "", "Saving a memory is a two-step process:", "", "**Step 1** — write the memory to its own file in the chosen directory (private or team, per the type's scope guidance) using this frontmatter format:", "", ...w36, "", `**Step 2** — add a pointer to that file in the same directory's \`${o2}\`. Each directory (private and team) has its own \`${o2}\` index — these contain only links to memory files with brief descriptions. They have no frontmatter. Never write memory content directly into a \`${o2}\`.`, "", `- Both \`${o2}\` indexes are loaded into your conversation context — lines after ${uj} will be truncated, so keep them concise`, "- Keep the name, description, and type fields in memory files up-to-date with the content", "- Organize memory semantically by topic, not chronologically", "- Update or remove memories that turn out to be wrong or outdated", "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one.", "", "## When to access memories", "- When specific known memories (personal or team) seem relevant to the task at hand.", "- When the user seems to be referring to work you may have done in a prior conversation with them or other users in their organization.", "- You MUST access memory when the user explicitly asks you to check memory, recall, or remember.", "", "## Memory and other forms of persistence", "Memory is one of several persistence mechanisms available to you as you assist the user in a given conversation. The distinction is often that memory can be recalled in future conversations and should not be used for persisting information that is only useful within the scope of the current conversation.", "- When to use or update a plan instead of memory: If you are about to start a non-trivial implementation task and would like to reach alignment with the user on your approach you should use a Plan rather than saving this information to memory. Similarly, if you already have a plan within the conversation and you have changed your approach persist that change by updating the plan rather than saving a memory.", "- When to use or update tasks instead of memory: When you need to break your work in current conversation into discrete steps or keep track of your progress use tasks instead of saving to memory. Tasks are great for persisting information about the work that needs to be done in the current conversation, but memory should be reserved for information that will be useful in future conversations.", "", ...Dt(A)].join(`
`)
}
// @from(Ln 218187, Col 0)
function bv9() {
    {
        let A = uH(),
            q = Lk();
        return ["# Memory", "", `You have a persistent, file-based memory system with two directories: a private directory at \`${A}\` and a shared team directory at \`${q}\`.`, "", `Each directory has a \`${o2}\` index of memory files, loaded into your conversation context (first ${uj} lines). Use these indexes to find relevant notes from prior sessions.`, "", "A background agent automatically extracts and saves memories from this conversation. If the user asks you to remember or forget something, acknowledge it — the save happens automatically. You should not write to memory files yourself.", "", "## Memory scope", "", "There are two scope levels:", "", `- private: memories that are private between you and the current user. They persist across conversations with only this specific user and are stored at the root \`${A}\`.`, `- team: memories that are shared with and contributed by all of the users who work within this project directory. Team memories are synced at the beginning of every session and they are stored at \`${q}\`.`, "", "## When to access memories", "- When specific known memories (personal or team) seem relevant to the task at hand.", "- When the user seems to be referring to work you may have done in a prior conversation with them or other users in their organization.", "- You MUST access memory when the user explicitly asks you to check memory, recall, or remember.", "", ...Dt(A)].join(`
`)
    }
    return ""
}
// @from(Ln 218196, Col 4)
g14 = E(() => {
    mH();
    Rk();
    k06();
    jF6()
})
// @from(Ln 218202, Col 0)
async function CD1(A) {
    let q = $1();
    try {
        await q.mkdir(A)
    } catch (K) {
        let Y = K instanceof Error && "code" in K && typeof K.code === "string" ? K.code : void 0;
        k(`ensureMemoryDirExists failed for ${A}: ${Y??String(K)}`, {
            level: "debug"
        })
    }
}
// @from(Ln 218214, Col 0)
function DF6(A, q) {
    $1().readdir(A).then((Y) => {
        let z = 0,
            _ = 0;
        for (let w of Y)
            if (w.isFile()) z++;
            else if (w.isDirectory()) _++;
        d("tengu_memdir_loaded", {
            ...q,
            total_file_count: z,
            total_subdir_count: _
        })
    }, () => {
        d("tengu_memdir_loaded", q)
    })
}
// @from(Ln 218231, Col 0)
function Q14(A) {
    let {
        displayName: q,
        memoryDir: K,
        extraGuidelines: Y
    } = A, z = $1(), _ = K + o2, w = "";
    try {
        w = z.readFileSync(_, {
            encoding: "utf-8"
        })
    } catch {}
    let O = [`# ${q}`, "", `You have a persistent ${q} directory at \`${K}\`. ${Uf8} Its contents persist across conversations.`, "", `As you work, consult your memory files to build on previous experience. When you encounter a mistake that seems like it could be common, check your ${q} for relevant notes — and if nothing is written yet, record what you learned.`, "", "Guidelines:", `- \`${o2}\` is always loaded into your system prompt — lines after ${uj} will be truncated, so keep it concise`, "- Create separate topic files (e.g., `debugging.md`, `patterns.md`) for detailed notes and link to them from MEMORY.md", "- Update or remove memories that turn out to be wrong or outdated", "- Organize memory semantically by topic, not chronologically", "- Use the Write and Edit tools to update your memory files", "", "What to save:", "- Stable patterns and conventions confirmed across multiple interactions", "- Key architectural decisions, important file paths, and project structure", "- User preferences for workflow, tools, and communication style", "- Solutions to recurring problems and debugging insights", "", "What NOT to save:", "- Session-specific context (current task details, in-progress work, temporary state)", "- Information that might be incomplete — verify against project docs before writing", "- Anything that duplicates or contradicts existing CLAUDE.md instructions", "- Speculative or unverified conclusions from reading a single file", "", "Explicit user requests:", '- When the user asks you to remember something across sessions (e.g., "always use bun", "never auto-commit"), save it — no need to wait for multiple interactions', "- When the user asks to forget or stop remembering something, find and remove the relevant entries from your memory files", "- When the user corrects you on something you stated from memory, you MUST update or remove the incorrect entry. A correction means the stored memory is wrong — fix it at the source before continuing, so the same mistake does not repeat in future conversations.", ...Y ?? [], ""];
    if (O.push(...Dt(K)), w.trim()) {
        let $ = w.trim().split(`
`),
            H = $.length > uj,
            j = q === p14 ? "auto" : "agent";
        DF6(K, {
            content_length: w.length,
            line_count: $.length,
            was_truncated: H,
            memory_type: j
        });
        let J = w.trim();
        if (H) J = $.slice(0, uj).join(`
`) + `

> WARNING: ${o2} is ${$.length} lines (limit: ${uj}). Only the first ${uj} lines were loaded. Move detailed content into separate topic files and keep ${o2} as a concise index.`;
        O.push(`## ${o2}`, "", J)
    } else O.push(`## ${o2}`, "", `Your ${o2} is currently empty. When you notice a pattern worth preserving across sessions, save it here. Anything in ${o2} will be included in your system prompt next time.`);
    return O.join(`
`)
}
// @from(Ln 218265, Col 0)
function U14(A, q, K) {
    let Y = [`# ${A}`, "", `You have a persistent, file-based memory system at \`${q}\`. ${Uf8}`, "", "You should build up this memory system over time so that future conversations can have a complete picture of who the user is, how they'd like to collaborate with you, what behaviors to avoid or repeat, and the context behind the work the user gives you.", "", "If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.", "", ...RD1, ..._36, "", "## How to save memories", "", "Saving a memory is a two-step process:", "", "**Step 1** — write the memory to its own file (e.g., `user_role.md`, `feedback_testing.md`) using this frontmatter format:", "", ...w36, "", `**Step 2** — add a pointer to that file in \`${o2}\`. \`${o2}\` is an index, not a memory — it should contain only links to memory files with brief descriptions. It has no frontmatter. Never write memory content directly into \`${o2}\`.`, "", `- \`${o2}\` is always loaded into your conversation context — lines after ${uj} will be truncated, so keep the index concise`, "- Keep the name, description, and type fields in memory files up-to-date with the content", "- Organize memory semantically by topic, not chronologically", "- Update or remove memories that turn out to be wrong or outdated", "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one.", "", "## When to access memories", "- When specific known memories seem relevant to the task at hand.", "- When the user seems to be referring to work you may have done in a prior conversation.", "- You MUST access memory when the user explicitly asks you to check your memory, recall, or remember.", "", "## Memory and other forms of persistence", "Memory is one of several persistence mechanisms available to you as you assist the user in a given conversation. The distinction is often that memory can be recalled in future conversations and should not be used for persisting information that is only useful within the scope of the current conversation.", "- When to use or update a plan instead of memory: If you are about to start a non-trivial implementation task and would like to reach alignment with the user on your approach you should use a Plan rather than saving this information to memory. Similarly, if you already have a plan within the conversation and you have changed your approach persist that change by updating the plan rather than saving a memory.", "- When to use or update tasks instead of memory: When you need to break your work in current conversation into discrete steps or keep track of your progress use tasks instead of saving to memory. Tasks are great for persisting information about the work that needs to be done in the current conversation, but memory should be reserved for information that will be useful in future conversations.", "", ...K ?? [], ""];
    return Y.push(...Dt(q)), Y
}
// @from(Ln 218270, Col 0)
function xv9(A, q) {
    return [`# ${A}`, "", `You have a persistent, file-based memory system at \`${q}\`.`, "", `\`${o2}\` is an index of memory files, loaded into your conversation context (first ${uj} lines). Use it to find relevant notes from prior sessions.`, "", "A background agent automatically extracts and saves memories from this conversation. If the user asks you to remember or forget something, acknowledge it — the save happens automatically. You should not write to memory files yourself.", "", "## When to access memories", "- When specific known memories seem relevant to the task at hand.", "- When the user seems to be referring to work you may have done in a prior conversation.", "- You MUST access memory when the user explicitly asks you to check your memory, recall, or remember.", "", ...Dt(q)]
}
// @from(Ln 218274, Col 0)
function d14(A) {
    let {
        displayName: q,
        memoryDir: K,
        extraGuidelines: Y
    } = A, z = $1(), _ = K + o2, w = "";
    try {
        w = z.readFileSync(_, {
            encoding: "utf-8"
        })
    } catch {}
    let O = U14(q, K, Y);
    if (w.trim()) {
        let $ = w.trim().split(`
`),
            H = $.length > uj,
            j = q === p14 ? "auto" : "agent";
        DF6(K, {
            content_length: w.length,
            line_count: $.length,
            was_truncated: H,
            memory_type: j
        });
        let J = w.trim();
        if (H) J = $.slice(0, uj).join(`
`) + `

> WARNING: ${o2} is ${$.length} lines (limit: ${uj}). Only the first ${uj} lines were loaded. Move detailed content into separate topic files and keep ${o2} as a concise index.`;
        O.push(`## ${o2}`, "", J)
    } else O.push(`## ${o2}`, "", `Your ${o2} is currently empty. When you save new memories, they will appear here.`);
    return O.join(`
`)
}
// @from(Ln 218308, Col 0)
function uv9() {
    let A = uH();
    return ["# auto memory", "", `You have a persistent auto memory directory at \`${A}\`. ${Uf8} Its contents persist across conversations.`, "", "As you work, consult your memory files to build on previous experience.", "", "## How to save memories:", "- Organize memory semantically by topic, not chronologically", "- Use the Write and Edit tools to update your memory files", `- \`${o2}\` is always loaded into your conversation context — lines after ${uj} will be truncated, so keep it concise`, "- Create separate topic files (e.g., `debugging.md`, `patterns.md`) for detailed notes and link to them from MEMORY.md", "- Update or remove memories that turn out to be wrong or outdated", "- Do not write duplicate memories. First check if there is an existing memory you can update before writing a new one.", "", "## What to save:", "- Stable patterns and conventions confirmed across multiple interactions", "- Key architectural decisions, important file paths, and project structure", "- User preferences for workflow, tools, and communication style", "- Solutions to recurring problems and debugging insights", "", "## What NOT to save:", "- Session-specific context (current task details, in-progress work, temporary state)", "- Information that might be incomplete — verify against project docs before writing", "- Anything that duplicates or contradicts existing CLAUDE.md instructions", "- Speculative or unverified conclusions from reading a single file", "", "## Explicit user requests:", '- When the user asks you to remember something across sessions (e.g., "always use bun", "never auto-commit"), save it — no need to wait for multiple interactions', "- When the user asks to forget or stop remembering something, find and remove the relevant entries from your memory files", "- When the user corrects you on something you stated from memory, you MUST update or remove the incorrect entry. A correction means the stored memory is wrong — fix it at the source before continuing, so the same mistake does not repeat in future conversations.", "", ...Dt(A)].join(`
`)
}
// @from(Ln 218314, Col 0)
function Dt(A) {
    if (!w8("tengu_coral_fern", !1)) return [];
    let q = mj(AA()),
        K = n$(),
        Y = K ? `grep -rn "<search term>" ${A} --include="*.md"` : `${N9} with pattern="<search term>" path="${A}" glob="*.md"`,
        z = K ? `grep -rn "<search term>" ${q}/ --include="*.jsonl"` : `${N9} with pattern="<search term>" path="${q}/" glob="*.jsonl"`;
    return ["## Searching past context", "", "When looking for past context:", "1. Search topic files in your memory directory:", "```", Y, "```", "2. Session transcript logs (last resort — large files, slow):", "```", z, "```", "Use narrow search terms (error messages, file paths, function names) rather than broad keywords.", ""]
}
// @from(Ln 218322, Col 0)
async function ID1() {
    let A = Z3(),
        q = w8("tengu_swinburne_dune", !1);
    if (F14.isTeamMemoryEnabled()) {
        let K = uH(),
            Y = F14.getTeamMemPath();
        if (await CD1(Y), DF6(K, {
                memory_type: "auto"
            }), DF6(Y, {
                memory_type: "team"
            }), w8("tengu_passport_quail", !1)) return Qf8.buildExtractModeTypedCombinedPrompt();
        if (q) return Qf8.buildTypedCombinedMemoryPrompt();
        return Qf8.buildCombinedMemoryPrompt()
    }
    if (A) {
        let K = uH();
        if (await CD1(K), DF6(K, {
                memory_type: "auto"
            }), w8("tengu_passport_quail", !1)) return xv9("auto memory", K).join(`
`);
        if (q) return U14("auto memory", K).join(`
`);
        return uv9()
    }
    if (d("tengu_memdir_disabled", {
            disabled_by_env_var: t6(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY),
            disabled_by_setting: !t6(process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY) && mA().autoMemoryEnabled === !1
        }), w8("tengu_herring_clock", !1)) d("tengu_team_memdir_disabled", {});
    return null
}
// @from(Ln 218352, Col 4)
F14
// @from(Ln 218352, Col 9)
o2 = "MEMORY.md"
// @from(Ln 218353, Col 4)
uj = 200
// @from(Ln 218354, Col 4)
p14 = "auto memory"
// @from(Ln 218355, Col 4)
Qf8
// @from(Ln 218355, Col 9)
Uf8 = "This directory already exists — write to it directly with the Write tool (do not run mkdir or check for its existence)."
// @from(Ln 218356, Col 4)
pf8 = "Both directories already exist — write to them directly with the Write tool (do not run mkdir or check for their existence)."
// @from(Ln 218357, Col 4)
k06 = E(() => {
    SA();
    mH();
    V1();
    A8();
    i8();
    HA();
    Oq();
    T1();
    uP();
    jF6();
    XI();
    H1();
    F14 = (Rk(), k4(Ld)), Qf8 = (g14(), k4(B14))
})
// @from(Ln 218372, Col 4)
s14 = {}
// @from(Ln 218406, Col 0)
function r14(A) {
    return Iv(A, AA())
}
// @from(Ln 218410, Col 0)
function dv9(A) {
    let {
        frontmatter: q,
        content: K
    } = BH(A);
    if (!q.paths) return {
        content: K
    };
    let Y = sz1(q.paths).map((z) => {
        return z.endsWith("/**") ? z.slice(0, -3) : z
    }).filter((z) => z.length > 0);
    if (Y.length === 0 || Y.every((z) => z === "**")) return {
        content: K
    };
    return {
        content: K,
        paths: Y
    }
}
// @from(Ln 218430, Col 0)
function o14(A) {
    if (!A.includes("<!--")) return {
        content: A,
        stripped: !1
    };
    let q = new tW().lex(A),
        K = "",
        Y = !1,
        z = /<!--[\s\S]*?-->/g;
    for (let _ of q) {
        if (_.type === "html") {
            let w = _.raw.trimStart();
            if (w.startsWith("<!--") && w.includes("-->")) {
                let O = _.raw.replace(z, "");
                if (Y = !0, O.trim().length > 0) K += O;
                continue
            }
        }
        K += _.raw
    }
    return {
        content: K,
        stripped: Y
    }
}
// @from(Ln 218456, Col 0)
function xD1(A, q) {
    try {
        let Y = $1().readFileSync(A, {
                encoding: "utf-8"
            }),
            z = pv9(A).toLowerCase();
        if (z && !Uv9.has(z)) return k(`Skipping non-text file in @include: ${A}`), null;
        let {
            content: _,
            paths: w
        } = dv9(Y), {
            content: O
        } = o14(_), $ = O;
        if (q === "AutoMem" || q === "TeamMem") {
            let j = O.trimEnd().split(`
`);
            if (j.length > uj) $ = j.slice(0, uj).join(`
`) + `

> WARNING: MEMORY.md is ${j.length} lines (limit: ${uj}). Only the first ${uj} lines were loaded. Move detailed content into separate topic files and keep MEMORY.md as a concise index.`
        }
        let H = $ !== Y;
        return {
            path: A,
            type: q,
            content: $,
            globs: w,
            contentDiffersFromDisk: H,
            rawContent: H ? Y : void 0
        }
    } catch (K) {
        let Y = K.code;
        if (Y === "ENOENT" || Y === "EISDIR") return null;
        if (Y === "EACCES") d("tengu_claude_md_permission_error", {
            is_access_error: 1,
            has_home_dir: A.includes(c8()) ? 1 : 0
        })
    }
    return null
}
// @from(Ln 218497, Col 0)
function cv9(A, q) {
    let K = new Set,
        z = new tW({
            gfm: !1
        }).lex(A);

    function _(w) {
        for (let O of w) {
            if (O.type === "code" || O.type === "codespan") continue;
            if (O.type === "text") {
                let $ = O.text || "",
                    H = /(?:^|\s)@((?:[^\s\\]|\\ )+)/g,
                    j;
                while ((j = H.exec($)) !== null) {
                    let J = j[1];
                    if (!J) continue;
                    let M = J.indexOf("#");
                    if (M !== -1) J = J.substring(0, M);
                    if (!J) continue;
                    if (J = J.replace(/\\ /g, " "), J) {
                        if (J.startsWith("./") || J.startsWith("~/") || J.startsWith("/") && J !== "/" || !J.startsWith("@") && !J.match(/^[#%^&*()]+/) && J.match(/^[a-zA-Z0-9._-]/)) {
                            let X = L4(J, XF6(q));
                            K.add(X)
                        }
                    }
                }
            }
            if (O.tokens) _(O.tokens);
            if (O.items) _(O.items)
        }
    }
    return _(z), [...K]
}
// @from(Ln 218531, Col 0)
function iv9(A, q) {
    if (q !== "User" && q !== "Project" && q !== "Local") return !1;
    let K = mA().claudeMdExcludes;
    if (!K || K.length === 0) return !1;
    let Y = {
            dot: !0
        },
        z = A.replaceAll("\\", "/"),
        _ = nv9(K).filter((w) => w.length > 0);
    if (_.length === 0) return !1;
    return n14.default.isMatch(z, _, Y)
}
// @from(Ln 218544, Col 0)
function nv9(A) {
    let q = $1(),
        K = A.map((Y) => Y.replaceAll("\\", "/"));
    for (let Y of K) {
        if (!Y.startsWith("/")) continue;
        let z = Y.search(/[*?{[]/),
            _ = z === -1 ? Y : Y.slice(0, z),
            w = XF6(_);
        try {
            let O = q.realpathSync(w).replaceAll("\\", "/");
            if (O !== w) {
                let $ = O + Y.slice(w.length);
                K.push($)
            }
        } catch {}
    }
    return K
}
// @from(Ln 218563, Col 0)
function Sk(A, q, K, Y, z = 0, _) {
    let w = $$(A);
    if (K.has(w) || z >= lv9) return [];
    if (iv9(A, q)) return [];
    let {
        resolvedPath: O,
        isSymlink: $
    } = qO($1(), A);
    if (K.add(w), $) K.add($$(O));
    let H = xD1(A, q);
    if (!H || !H.content.trim()) return [];
    if (_) H.parent = _;
    let j = [];
    j.push(H);
    let J = cv9(H.content, O);
    for (let M of J) {
        if (!r14(M) && !Y) continue;
        let X = Sk(M, q, K, Y, z + 1, A);
        j.push(...X)
    }
    return j
}
// @from(Ln 218586, Col 0)
function Xt({
    rulesDir: A,
    type: q,
    processedPaths: K,
    includeExternal: Y,
    conditionalRule: z,
    visitedDirs: _ = new Set
}) {
    if (_.has(A)) return [];
    try {
        let w = $1(),
            {
                resolvedPath: O,
                isSymlink: $
            } = qO(w, A);
        if (_.add(A), $) _.add(O);
        let H = [],
            j;
        try {
            j = w.readdirSync(O)
        } catch (J) {
            let M = J.code;
            if (M === "ENOENT" || M === "EACCES" || M === "ENOTDIR") return [];
            throw J
        }
        for (let J of j) {
            let M = hk(A, J.name),
                {
                    resolvedPath: D,
                    isSymlink: X
                } = qO(w, M),
                P = X ? w.statSync(D) : null,
                W = P ? P.isDirectory() : J.isDirectory(),
                Z = P ? P.isFile() : J.isFile();
            if (W) H.push(...Xt({
                rulesDir: D,
                type: q,
                processedPaths: K,
                includeExternal: Y,
                conditionalRule: z,
                visitedDirs: _
            }));
            else if (Z && J.name.endsWith(".md")) {
                let G = Sk(D, q, K, Y);
                H.push(...G.filter((f) => z ? f.globs : !f.globs))
            }
        }
        return H
    } catch (w) {
        if (w instanceof Error && w.message.includes("EACCES")) d("tengu_claude_rules_md_permission_error", {
            is_access_error: 1,
            has_home_dir: A.includes(c8()) ? 1 : 0
        });
        return []
    }
}
// @from(Ln 218643, Col 0)
function rv9(A) {
    return A === "User" || A === "Project" || A === "Local" || A === "Managed"
}
// @from(Ln 218647, Col 0)
function cf8() {
    vO.cache.clear?.()
}
// @from(Ln 218651, Col 0)
function Pt() {
    return vO().filter((A) => A.content.length > JB)
}
// @from(Ln 218655, Col 0)
function Wt() {
    return null
}
// @from(Ln 218659, Col 0)
function uD1() {
    return []
}
// @from(Ln 218663, Col 0)
function if8(A, q) {
    let K = [],
        Y = BD1();
    if (K.push(...PF6(A, Y, "Managed", q, !1)), SH("userSettings")) {
        let z = gD1();
        K.push(...PF6(A, z, "User", q, !0))
    }
    return K
}
// @from(Ln 218673, Col 0)
function nf8(A, q, K) {
    let Y = [];
    if (SH("projectSettings")) {
        let w = hk(A, "CLAUDE.md");
        Y.push(...Sk(w, "Project", K, !1));
        let O = hk(A, ".claude", "CLAUDE.md");
        Y.push(...Sk(O, "Project", K, !1))
    }
    if (SH("localSettings")) {
        let w = hk(A, "CLAUDE.local.md");
        Y.push(...Sk(w, "Local", K, !1))
    }
    let z = hk(A, ".claude", "rules"),
        _ = new Set(K);
    Y.push(...Xt({
        rulesDir: z,
        type: "Project",
        processedPaths: _,
        includeExternal: !1,
        conditionalRule: !1
    })), Y.push(...PF6(q, z, "Project", K, !1));
    for (let w of _) K.add(w);
    return Y
}
// @from(Ln 218698, Col 0)
function rf8(A, q, K) {
    let Y = hk(A, ".claude", "rules");
    return PF6(q, Y, "Project", K, !1)
}
// @from(Ln 218703, Col 0)
function PF6(A, q, K, Y, z) {
    return Xt({
        rulesDir: q,
        type: K,
        processedPaths: Y,
        includeExternal: z,
        conditionalRule: !0
    }).filter((w) => {
        if (!w.globs || w.globs.length === 0) return !1;
        let O = K === "Project" ? XF6(XF6(q)) : AA(),
            $ = gv9(A) ? Bv9(O, A) : A;
        return i14.default().add(w.globs).ignores($)
    })
}
// @from(Ln 218718, Col 0)
function E06() {
    let A = [];
    for (let q of vO(!0))
        if (q.type !== "User" && q.parent && !r14(q.path)) A.push({
            path: q.path,
            parent: q.parent
        });
    return A
}
// @from(Ln 218728, Col 0)
function mD1() {
    return E06().length > 0
}
// @from(Ln 218731, Col 0)
async function of8() {
    let A = d2();
    if (A.hasClaudeMdExternalIncludesApproved || A.hasClaudeMdExternalIncludesWarningShown) return !1;
    return mD1()
}
// @from(Ln 218737, Col 0)
function a14(A) {
    let q = Fv9(A);
    if (q === "CLAUDE.md" || q === "CLAUDE.local.md") return !0;
    if (q.endsWith(".md") && A.includes(`${df8}.claude${df8}rules${df8}`)) return !0;
    return !1
}
// @from(Ln 218744, Col 0)
function ov9(A) {
    let q = new Set;
    for (let K of vO())
        if (K.content.trim().length > 0) q.add(K.path);
    for (let K of jB(A))
        if (a14(K)) q.add(K);
    return Array.from(q)
}
// @from(Ln 218752, Col 4)
i14
// @from(Ln 218752, Col 9)
n14
// @from(Ln 218752, Col 14)
c14
// @from(Ln 218752, Col 19)
l14 = !1
// @from(Ln 218753, Col 4)
Qv9 = "Codebase and user instructions are shown below. Be sure to adhere to these instructions. IMPORTANT: These instructions OVERRIDE any default behavior and you MUST follow them exactly as written."
// @from(Ln 218754, Col 4)
JB = 40000
// @from(Ln 218755, Col 4)
O36 = 3000
// @from(Ln 218756, Col 4)
Uv9
// @from(Ln 218756, Col 9)
lv9 = 5
// @from(Ln 218757, Col 4)
vO
// @from(Ln 218757, Col 8)
lf8 = () => {
        let A = vO(),
            q = [],
            K = w8("tengu_paper_halyard", !1);
        for (let Y of A) {
            if (K && (Y.type === "Project" || Y.type === "Local")) continue;
            if (Y.content) {
                let z = Y.type === "Project" ? " (project instructions, checked into the codebase)" : Y.type === "Local" ? " (user's private project instructions, not checked in)" : Y.type === "TeamMem" ? " (shared team memory, synced across the organization)" : Y.type === "AutoMem" ? " (user's auto-memory, persists across conversations)" : " (user's private global instructions for all projects)";
                if (Y.type === "TeamMem") q.push(`Contents of ${Y.path}${z}:

<team-memory-content source="shared">
${Y.content}
</team-memory-content>`);
                else q.push(`Contents of ${Y.path}${z}:

${Y.content}`)
            }
        }
        if (q.length === 0) return "";
        return `${Qv9}

${q.join(`

`)}`
    }
// @from(Ln 218782, Col 4)
lM = E(() => {
    U4();
    T1();
    SA();
    F9();
    V1();
    HF6();
    O2();
    i8();
    RY();
    Z7();
    $5();
    k8();
    A8();
    BG();
    tP();
    H1();
    u_();
    HA();
    mH();
    mH();
    k06();
    hw();
    i14 = t(Kq6(), 1), n14 = t(j14(), 1), c14 = (Rk(), k4(Ld)), Uv9 = new Set([".md", ".txt", ".text", ".json", ".yaml", ".yml", ".toml", ".xml", ".csv", ".html", ".htm", ".css", ".scss", ".sass", ".less", ".js", ".ts", ".tsx", ".jsx", ".mjs", ".cjs", ".mts", ".cts", ".py", ".pyi", ".pyw", ".rb", ".erb", ".rake", ".go", ".rs", ".java", ".kt", ".kts", ".scala", ".c", ".cpp", ".cc", ".cxx", ".h", ".hpp", ".hxx", ".cs", ".swift", ".sh", ".bash", ".zsh", ".fish", ".ps1", ".bat", ".cmd", ".env", ".ini", ".cfg", ".conf", ".config", ".properties", ".sql", ".graphql", ".gql", ".proto", ".vue", ".svelte", ".astro", ".ejs", ".hbs", ".pug", ".jade", ".php", ".pl", ".pm", ".lua", ".r", ".R", ".dart", ".ex", ".exs", ".erl", ".hrl", ".clj", ".cljs", ".cljc", ".edn", ".hs", ".lhs", ".elm", ".ml", ".mli", ".f", ".f90", ".f95", ".for", ".cmake", ".make", ".makefile", ".gradle", ".sbt", ".rst", ".adoc", ".asciidoc", ".org", ".tex", ".latex", ".lock", ".log", ".diff", ".patch"]);
    vO = e1((A = !1) => {
        let q = Date.now();
        U1("info", "memory_files_started");
        let K = [],
            Y = new Set,
            z = d2(),
            _ = A || z.hasClaudeMdExternalIncludesApproved || !1,
            w = PI("Managed");
        K.push(...Sk(w, "Managed", Y, _));
        let O = BD1();
        if (K.push(...Xt({
                rulesDir: O,
                type: "Managed",
                processedPaths: Y,
                includeExternal: _,
                conditionalRule: !1
            })), SH("userSettings")) {
            let W = PI("User");
            K.push(...Sk(W, "User", Y, !0));
            let Z = gD1();
            K.push(...Xt({
                rulesDir: Z,
                type: "User",
                processedPaths: Y,
                includeExternal: !0,
                conditionalRule: !1
            }))
        }
        let $ = [],
            H = AA(),
            j = H;
        while (j !== mv9(j).root) $.push(j), j = XF6(j);
        let J = H_(H),
            M = LJ(H),
            D = J !== null && M !== null && $$(J) !== $$(M) && Iv(J, M);
        for (let W of $.reverse()) {
            let Z = D && Iv(W, M) && !Iv(W, J);
            if (SH("projectSettings") && !Z) {
                let G = hk(W, "CLAUDE.md");
                K.push(...Sk(G, "Project", Y, _));
                let f = hk(W, ".claude", "CLAUDE.md");
                K.push(...Sk(f, "Project", Y, _));
                let v = hk(W, ".claude", "rules");
                K.push(...Xt({
                    rulesDir: v,
                    type: "Project",
                    processedPaths: Y,
                    includeExternal: _,
                    conditionalRule: !1
                }))
            }
            if (SH("localSettings")) {
                let G = hk(W, "CLAUDE.local.md");
                K.push(...Sk(G, "Local", Y, _))
            }
        }
        if (t6(process.env.CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD)) {
            let W = XT();
            for (let Z of W) {
                let G = hk(Z, "CLAUDE.md");
                K.push(...Sk(G, "Project", Y, _));
                let f = hk(Z, ".claude", "CLAUDE.md");
                K.push(...Sk(f, "Project", Y, _));
                let v = hk(Z, ".claude", "rules");
                K.push(...Xt({
                    rulesDir: v,
                    type: "Project",
                    processedPaths: Y,
                    includeExternal: _,
                    conditionalRule: !1
                }))
            }
        }
        if (Z3()) {
            let W = xD1($z1(), "AutoMem");
            if (W && !Y.has($$(W.path))) Y.add($$(W.path)), K.push(W)
        }
        if (c14.isTeamMemoryEnabled()) {
            let W = xD1(c14.getTeamMemEntrypoint(), "TeamMem");
            if (W && !Y.has($$(W.path))) Y.add($$(W.path)), K.push(W)
        }
        let X = K.reduce((W, Z) => W + Z.content.length, 0);
        U1("info", "memory_files_completed", {
            duration_ms: Date.now() - q,
            file_count: K.length,
            total_content_length: X
        });
        let P = {};
        for (let W of K) P[W.type] = (P[W.type] ?? 0) + 1;
        if (!l14) {
            if (l14 = !0, d("tengu_claudemd__initial_load", {
                    file_count: K.length,
                    total_content_length: X,
                    user_count: P.User ?? 0,
                    project_count: P.Project ?? 0,
                    local_count: P.Local ?? 0,
                    managed_count: P.Managed ?? 0,
                    automem_count: P.AutoMem ?? 0,
                    ...{
                        teammem_count: P.TeamMem ?? 0
                    },
                    duration_ms: Date.now() - q
                }), WF6())
                for (let W of K) {
                    if (!rv9(W.type)) continue;
                    let Z = W.parent ? "include" : "session_start";
                    ZF6(W.path, W.type, Z, {
                        globs: W.globs,
                        parentFilePath: W.parent
                    })
                }
        }
        return K
    })
})
// @from(Ln 218922, Col 0)
function t14(A) {
    sv9 = A, a2.cache.clear?.(), mw.cache.clear?.()
}
// @from(Ln 218925, Col 4)
af8 = 40000
// @from(Ln 218926, Col 4)
sv9 = null
// @from(Ln 218927, Col 4)
sf8
// @from(Ln 218927, Col 9)
mw
// @from(Ln 218927, Col 13)
a2
// @from(Ln 218928, Col 4)
bv = E(() => {
    k1();
    lM();
    U4();
    $5();
    Eq();
    u_();
    A8();
    sf8 = e1(async () => {
        let A = Date.now();
        U1("info", "git_status_started");
        let q = Date.now(),
            K = await IH();
        if (U1("info", "git_is_git_check_completed", {
                duration_ms: Date.now() - q,
                is_git: K
            }), !K) return U1("info", "git_status_skipped_not_git", {
            duration_ms: Date.now() - A
        }), null;
        try {
            let Y = Date.now(),
                [z, _, w, O] = await Promise.all([kj(), oT(), z8(hA(), ["--no-optional-locks", "status", "--short"], {
                    preserveOutputOnError: !1
                }).then(({
                    stdout: H
                }) => H.trim()), z8(hA(), ["--no-optional-locks", "log", "--oneline", "-n", "5"], {
                    preserveOutputOnError: !1
                }).then(({
                    stdout: H
                }) => H.trim())]);
            U1("info", "git_commands_completed", {
                duration_ms: Date.now() - Y,
                status_length: w.length
            });
            let $ = w.length > af8 ? w.substring(0, af8) + `
... (truncated because it exceeds 40k characters. If you need more information, run "git status" using BashTool)` : w;
            return U1("info", "git_status_completed", {
                duration_ms: Date.now() - A,
                truncated: w.length > af8
            }), `This is the git status at the start of the conversation. Note that this status is a snapshot in time, and will not update during the conversation.
Current branch: ${z}

Main branch (you will usually use this for PRs): ${_}

Status:
${$||"(clean)"}

Recent commits:
${O}`
        } catch (Y) {
            return U1("error", "git_status_failed", {
                duration_ms: Date.now() - A
            }), _6(Y), null
        }
    }), mw = e1(async () => {
        let A = Date.now();
        U1("info", "system_context_started");
        let q = t6(process.env.CLAUDE_CODE_REMOTE) ? null : await sf8(),
            K = null;
        return U1("info", "system_context_completed", {
            duration_ms: Date.now() - A,
            has_git_status: q !== null,
            has_injection: K !== null
        }), {
            ...q ? {
                gitStatus: q
            } : {},
            ...{}
        }
    }), a2 = e1(async () => {
        let A = Date.now();
        U1("info", "user_context_started");
        let q = process.env.CLAUDE_CODE_DISABLE_CLAUDE_MDS || t6(process.env.CLAUDE_CODE_SIMPLE),
            K = q ? null : lf8();
        return U1("info", "user_context_completed", {
            duration_ms: Date.now() - A,
            claudemd_length: K?.length ?? 0,
            claudemd_disabled: Boolean(q)
        }), {
            ...K ? {
                claudeMd: K
            } : {},
            currentDate: `Today's date is ${GD6()}.`
        }
    })
})
// @from(Ln 219015, Col 0)
function Rd(A) {
    if (A?.type === "assistant" && "usage" in A.message && !(A.message.content[0]?.type === "text" && TF6.has(A.message.content[0].text)) && A.message.model !== $36) return A.message.usage;
    return
}
// @from(Ln 219020, Col 0)
function e14(A) {
    if (A?.type === "assistant" && "id" in A.message && A.message.model !== $36) return A.message.id;
    return
}
// @from(Ln 219025, Col 0)
function fF6(A) {
    return A.input_tokens + (A.cache_creation_input_tokens ?? 0) + (A.cache_read_input_tokens ?? 0) + A.output_tokens
}
// @from(Ln 219029, Col 0)
function Ck(A) {
    let q = A.length - 1;
    while (q >= 0) {
        let K = A[q],
            Y = K ? Rd(K) : void 0;
        if (Y) return fF6(Y);
        q--
    }
    return 0
}
// @from(Ln 219040, Col 0)
function FD1(A) {
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q],
            Y = K ? Rd(K) : void 0;
        if (Y) return {
            input_tokens: Y.input_tokens,
            output_tokens: Y.output_tokens,
            cache_creation_input_tokens: Y.cache_creation_input_tokens ?? 0,
            cache_read_input_tokens: Y.cache_read_input_tokens ?? 0
        }
    }
    return null
}
// @from(Ln 219054, Col 0)
function pD1(A) {
    for (let K = A.length - 1; K >= 0; K--) {
        let Y = A[K];
        if (Y?.type === "assistant") {
            let z = Rd(Y);
            if (z) return fF6(z) > 200000;
            return !1
        }
    }
    return !1
}
// @from(Ln 219066, Col 0)
function A84(A) {
    if (A < 1000) return `~${A}`;
    return `~${(A/1000).toFixed(1)}k`
}
// @from(Ln 219071, Col 0)
function QD1(A) {
    let q = 0;
    for (let K of A.message.content)
        if (K.type === "text") q += K.text.length;
        else if (K.type === "thinking") q += K.thinking.length;
    else if (K.type === "redacted_thinking") q += K.data.length;
    else if (K.type === "tool_use") q += B6(K.input).length;
    return q
}
// @from(Ln 219081, Col 0)
function eW(A) {
    let q = A.length - 1;
    while (q >= 0) {
        let K = A[q],
            Y = K ? Rd(K) : void 0;
        if (K && Y) {
            let z = e14(K);
            if (z) {
                let _ = q - 1;
                while (_ >= 0) {
                    let w = A[_],
                        O = w ? e14(w) : void 0;
                    if (O === z) q = _;
                    else if (O !== void 0) break;
                    _--
                }
            }
            return fF6(Y) + GF6(A.slice(q + 1))
        }
        q--
    }
    return GF6(A)
}
// @from(Ln 219104, Col 4)
AZ = E(() => {
    JA();
    Hf();
    g1()
})
// @from(Ln 219109, Col 4)
q84
// @from(Ln 219109, Col 9)
K84 = "Update the todo list for the current session. To be used proactively and often to track progress and pending tasks. Make sure that at least one task is in_progress at all times. Always provide both content (imperative) and activeForm (present continuous) for each task."
// @from(Ln 219110, Col 4)
Y84 = E(() => {
    q84 = `Use this tool to create and manage a structured task list for your current coding session. This helps you track progress, organize complex tasks, and demonstrate thoroughness to the user.
It also helps the user understand the progress of the task and overall progress of their requests.

## When to Use This Tool
Use this tool proactively in these scenarios:

1. Complex multi-step tasks - When a task requires 3 or more distinct steps or actions
2. Non-trivial and complex tasks - Tasks that require careful planning or multiple operations
3. User explicitly requests todo list - When the user directly asks you to use the todo list
4. User provides multiple tasks - When users provide a list of things to be done (numbered or comma-separated)
5. After receiving new instructions - Immediately capture user requirements as todos
6. When you start working on a task - Mark it as in_progress BEFORE beginning work. Ideally you should only have one todo as in_progress at a time
7. After completing a task - Mark it as completed and add any new follow-up tasks discovered during implementation

## When NOT to Use This Tool

Skip using this tool when:
1. There is only a single, straightforward task
2. The task is trivial and tracking it provides no organizational benefit
3. The task can be completed in less than 3 trivial steps
4. The task is purely conversational or informational

NOTE that you should not use this tool if there is only one trivial task to do. In this case you are better off just doing the task directly.

## Examples of When to Use the Todo List

<example>
User: I want to add a dark mode toggle to the application settings. Make sure you run the tests and build when you're done!
Assistant: I'll help add a dark mode toggle to your application settings. Let me create a todo list to track this implementation.
*Creates todo list with the following items:*
1. Creating dark mode toggle component in Settings page
2. Adding dark mode state management (context/store)
3. Implementing CSS-in-JS styles for dark theme
4. Updating existing components to support theme switching
5. Running tests and build process, addressing any failures or errors that occur
*Begins working on the first task*

<reasoning>
The assistant used the todo list because:
1. Adding dark mode is a multi-step feature requiring UI, state management, and styling changes
2. The user explicitly requested tests and build be run afterward
3. The assistant inferred that tests and build need to pass by adding "Ensure tests and build succeed" as the final task
</reasoning>
</example>

<example>
User: Help me rename the function getCwd to getCurrentWorkingDirectory across my project
Assistant: Let me first search through your codebase to find all occurrences of 'getCwd'.
*Uses grep or search tools to locate all instances of getCwd in the codebase*
Assistant: I've found 15 instances of 'getCwd' across 8 different files. Let me create a todo list to track these changes.
*Creates todo list with specific items for each file that needs updating*

<reasoning>
The assistant used the todo list because:
1. First, the assistant searched to understand the scope of the task
2. Upon finding multiple occurrences across different files, it determined this was a complex task with multiple steps
3. The todo list helps ensure every instance is tracked and updated systematically
4. This approach prevents missing any occurrences and maintains code consistency
</reasoning>
</example>


<example>
User: I need to implement these features for my e-commerce site: user registration, product catalog, shopping cart, and checkout flow.
Assistant: I'll help implement these features. First, let's add all the features to the todo list.
*Creates a todo list breaking down each feature into specific tasks based on the project architecture*
Assistant: Let's start with user registration. This will involve creating database models, API endpoints, and frontend forms that integrate with your existing authentication system.

<reasoning>
The assistant used the todo list because:
1. The user provided multiple complex features to implement in a comma separated list
2. The todo list helps organize these large features into manageable tasks
3. This approach allows for tracking progress across the entire implementation
</reasoning>
</example>

<example>
User: Can you help optimize my React application? It's rendering slowly and has performance issues.
Assistant: I'll help optimize your React application. First, let me examine your codebase to identify potential performance bottlenecks.
*Reviews component structure, render patterns, state management, and data fetching*
Assistant: After analyzing your codebase, I've identified several performance issues. Let me create a todo list to track our optimization efforts.
*Creates todo list with items like: 1) Implementing memoization for expensive calculations in ProductList, 2) Adding virtualization for long lists in Dashboard, 3) Optimizing image loading in Gallery component, 4) Fixing state update loops in ShoppingCart, 5) Reviewing bundle size and implementing code splitting*
Let's start by implementing memoization for the expensive calculations in your ProductList component.

<reasoning>
The assistant used the todo list because:
1. First, the assistant examined the codebase to identify specific performance issues
2. Based on this analysis, it identified multiple optimization opportunities
3. Performance optimization is a non-trivial task requiring multiple steps
4. The todo list helps methodically track improvements across different components
5. This systematic approach ensures all performance bottlenecks are addressed
</reasoning>
</example>

## Examples of When NOT to Use the Todo List

<example>
User: How do I print 'Hello World' in Python?
Assistant: In Python, you can print "Hello World" with this simple code:

python
print("Hello World")

This will output the text "Hello World" to the console when executed.

<reasoning>
The assistant did not use the todo list because this is a single, trivial task that can be completed in one step. There's no need to track multiple tasks or steps for such a straightforward request.
</reasoning>
</example>

<example>
User: What does the git status command do?
Assistant: The git status command shows the current state of your working directory and staging area. It displays which changes have been staged, which haven't, and which files aren't being tracked by Git. This is a fundamental command for understanding the current state of your repository before making commits.

<reasoning>
The assistant did not use the todo list because this is an informational request with no actual coding task to complete. The user is simply asking for an explanation, not for the assistant to perform multiple steps or tasks.
</reasoning>
</example>

<example>
User: Can you add a comment to the calculateTotal function to explain what it does?
Assistant: Sure, let me add a comment to the calculateTotal function to explain what it does.
* Uses the ${R4} tool to add a comment to the calculateTotal function *

<reasoning>
The assistant did not use the todo list because this is a single, straightforward task confined to one location in the code. Adding a comment doesn't require tracking multiple steps or systematic organization.
</reasoning>
</example>

<example>
User: Run npm install for me and tell me what happens.
Assistant: I'll run the npm install command for you.

*Executes: npm install*

The command completed successfully. Here's the output:
[Output of npm install command]

All dependencies have been installed according to your package.json file.

<reasoning>
The assistant did not use the todo list because this is a single command execution with immediate results. There are no multiple steps to track or organize, making the todo list unnecessary for this straightforward task.
</reasoning>
</example>

## Task States and Management

1. **Task States**: Use these states to track progress:
   - pending: Task not yet started
   - in_progress: Currently working on (limit to ONE task at a time)
   - completed: Task finished successfully

   **IMPORTANT**: Task descriptions must have two forms:
   - content: The imperative form describing what needs to be done (e.g., "Run tests", "Build the project")
   - activeForm: The present continuous form shown during execution (e.g., "Running tests", "Building the project")

2. **Task Management**:
   - Update task status in real-time as you work
   - Mark tasks complete IMMEDIATELY after finishing (don't batch completions)
   - Exactly ONE task must be in_progress at any time (not less, not more)
   - Complete current tasks before starting new ones
   - Remove tasks that are no longer relevant from the list entirely

3. **Task Completion Requirements**:
   - ONLY mark a task as completed when you have FULLY accomplished it
   - If you encounter errors, blockers, or cannot finish, keep the task as in_progress
   - When blocked, create a new task describing what needs to be resolved
   - Never mark a task as completed if:
     - Tests are failing
     - Implementation is partial
     - You encountered unresolved errors
     - You couldn't find necessary files or dependencies

4. **Task Breakdown**:
   - Create specific, actionable items
   - Break complex tasks into smaller, manageable steps
   - Use clear, descriptive task names
   - Always provide both forms:
     - content: "Fix authentication bug"
     - activeForm: "Fixing authentication bug"

When in doubt, use this tool. Being proactive with task management demonstrates attentiveness and ensures you complete all requirements successfully.
`
})
// @from(Ln 219295, Col 4)
tv9
// @from(Ln 219295, Col 9)
ev9
// @from(Ln 219295, Col 14)
y06
// @from(Ln 219296, Col 4)
tf8 = E(() => {
    K7();
    tv9 = F6(() => C.enum(["pending", "in_progress", "completed"])), ev9 = F6(() => C.object({
        content: C.string().min(1, "Content cannot be empty"),
        status: tv9(),
        activeForm: C.string().min(1, "Active form cannot be empty")
    })), y06 = F6(() => C.array(ev9()))
})
// @from(Ln 219305, Col 0)
function z84() {
    return null
}
// @from(Ln 219309, Col 0)
function _84() {
    return null
}
// @from(Ln 219313, Col 0)
function w84() {
    return null
}
// @from(Ln 219317, Col 0)
function O84() {
    return null
}
// @from(Ln 219321, Col 0)
function $84() {
    return null
}
// @from(Ln 219324, Col 4)
MB = "TodoWrite"
// @from(Ln 219329, Col 0)
function iM() {
    return ef8.getStore()
}
// @from(Ln 219333, Col 0)
function UD1(A, q) {
    return ef8.run(A, q)
}
// @from(Ln 219337, Col 0)
function eP() {
    return ef8.getStore() !== void 0
}
// @from(Ln 219341, Col 0)
function dD1(A) {
    return {
        ...A,
        isInProcess: !0
    }
}
// @from(Ln 219347, Col 4)
ef8
// @from(Ln 219348, Col 4)
qZ = E(() => {
    ef8 = new AN9
})
// @from(Ln 219351, Col 4)
KT8 = {}
// @from(Ln 219373, Col 0)
function Zt() {
    let A = iM();
    if (A) return A.parentSessionId;
    return Ik?.parentSessionId
}
// @from(Ln 219379, Col 0)
function qN9(A) {
    Ik = A
}
// @from(Ln 219383, Col 0)
function KN9() {
    Ik = null
}
// @from(Ln 219387, Col 0)
function vF6() {
    return Ik
}
// @from(Ln 219391, Col 0)
function nM() {
    let A = iM();
    if (A) return A.agentId;
    return Ik?.agentId
}
// @from(Ln 219397, Col 0)
function i3() {
    let A = iM();
    if (A) return A.agentName;
    return Ik?.agentName
}
// @from(Ln 219403, Col 0)
function l5(A) {
    let q = iM();
    if (q) return q.teamName;
    if (Ik?.teamName) return Ik.teamName;
    return A?.teamName
}
// @from(Ln 219410, Col 0)
function $Y() {
    if (iM()) return !0;
    return !!(Ik?.agentId && Ik?.teamName)
}
// @from(Ln 219415, Col 0)
function H$() {
    let A = iM();
    if (A) return A.color;
    return Ik?.color
}
// @from(Ln 219421, Col 0)
function NF6() {
    let A = iM();
    if (A) return A.planModeRequired;
    if (Ik !== null) return Ik.planModeRequired;
    return t6(process.env.CLAUDE_CODE_PLAN_MODE_REQUIRED)
}
// @from(Ln 219428, Col 0)
function KZ(A) {
    if (!A?.leadAgentId) return !1;
    let q = nM(),
        K = A.leadAgentId;
    if (q === K) return !0;
    if (!q) return !0;
    return !1
}
// @from(Ln 219437, Col 0)
function cD1(A) {
    for (let q of Object.values(A.tasks))
        if (q.type === "in_process_teammate" && q.status === "running") return !0;
    return !1
}
// @from(Ln 219443, Col 0)
function AT8(A) {
    for (let q of Object.values(A.tasks))
        if (q.type === "in_process_teammate" && q.status === "running" && !q.isIdle) return !0;
    return !1
}
// @from(Ln 219449, Col 0)
function qT8(A, q) {
    let K = [];
    for (let [Y, z] of Object.entries(q.tasks))
        if (z.type === "in_process_teammate" && z.status === "running" && !z.isIdle) K.push(Y);
    if (K.length === 0) return Promise.resolve();
    return new Promise((Y) => {
        let z = K.length,
            _ = () => {
                if (z--, z === 0) Y()
            };
        A((w) => {
            let O = {
                ...w.tasks
            };
            for (let $ of K) {
                let H = O[$];
                if (H && H.type === "in_process_teammate")
                    if (H.isIdle) _();
                    else O[$] = {
                        ...H,
                        onIdleCallbacks: [...H.onIdleCallbacks ?? [], _]
                    }
            }
            return {
                ...w,
                tasks: O
            }
        })
    })
}
// @from(Ln 219479, Col 4)
Ik = null
// @from(Ln 219480, Col 4)
zz = E(() => {
    qZ();
    qZ();
    A8()
})
// @from(Ln 219496, Col 0)
function J84(A) {
    if (VF6 === A) return;
    VF6 = A, Gt()
}
// @from(Ln 219501, Col 0)
function M84() {
    if (VF6 === void 0) return;
    VF6 = void 0, Gt()
}
// @from(Ln 219506, Col 0)
function D84(A) {
    return lD1.add(A), lD1.delete.bind(lD1, A)
}
// @from(Ln 219510, Col 0)
function Gt() {
    for (let A of lD1) try {
        A()
    } catch {}
}
// @from(Ln 219516, Col 0)
function X84(A) {
    return kF6(wR(A), _N9)
}
// @from(Ln 219519, Col 0)
async function zT8(A) {
    let q = X84(A);
    try {
        let K = (await H84(q, "utf-8")).trim(),
            Y = parseInt(K, 10);
        return isNaN(Y) ? 0 : Y
    } catch {
        return 0
    }
}
// @from(Ln 219529, Col 0)
async function P84(A, q) {
    let K = X84(A);
    await iD1(K, String(q))
}
// @from(Ln 219534, Col 0)
function r$() {
    if (t6(process.env.CLAUDE_CODE_ENABLE_TASKS)) return !0;
    return !q7()
}
// @from(Ln 219538, Col 0)
async function rD1(A) {
    let q = wR(A),
        K = await wT8(A),
        Y;
    try {
        Y = await EF6.lock(K, nD1);
        let z = await W84(A);
        if (z > 0) {
            let w = await zT8(A);
            if (z > w) await P84(A, z)
        }
        let _;
        try {
            _ = await YT8(q)
        } catch {
            _ = []
        }
        for (let w of _)
            if (w.endsWith(".json") && !w.startsWith(".")) {
                let O = kF6(q, w);
                try {
                    await j84(O)
                } catch {}
            } Gt()
    } finally {
        if (Y) await Y()
    }
}
// @from(Ln 219567, Col 0)
function jf() {
    if (process.env.CLAUDE_CODE_TASK_LIST_ID) return process.env.CLAUDE_CODE_TASK_LIST_ID;
    let A = iM();
    if (A) return A.teamName;
    return l5() || VF6 || R1()
}
// @from(Ln 219574, Col 0)
function L06(A) {
    return A.replace(/[^a-zA-Z0-9_-]/g, "-")
}
// @from(Ln 219578, Col 0)
function wR(A) {
    return kF6(c8(), "tasks", L06(A))
}
// @from(Ln 219582, Col 0)
function yF6(A, q) {
    return kF6(wR(A), `${L06(q)}.json`)
}
// @from(Ln 219585, Col 0)
async function oD1(A) {
    let q = wR(A);
    try {
        await YN9(q, {
            recursive: !0
        })
    } catch {}
}
// @from(Ln 219593, Col 0)
async function W84(A) {
    let q = wR(A),
        K;
    try {
        K = await YT8(q)
    } catch {
        return 0
    }
    let Y = 0;
    for (let z of K) {
        if (!z.endsWith(".json")) continue;
        let _ = parseInt(z.replace(".json", ""), 10);
        if (!isNaN(_) && _ > Y) Y = _
    }
    return Y
}
// @from(Ln 219609, Col 0)
async function wN9(A) {
    let [q, K] = await Promise.all([W84(A), zT8(A)]);
    return Math.max(q, K)
}
// @from(Ln 219613, Col 0)
async function aD1(A, q) {
    let K = await wT8(A),
        Y;
    try {
        Y = await EF6.lock(K, nD1);
        let z = await wN9(A),
            _ = String(z + 1),
            w = {
                id: _,
                ...q
            },
            O = yF6(A, _);
        return await iD1(O, B6(w, null, 2)), Gt(), _
    } finally {
        if (Y) await Y()
    }
}
// @from(Ln 219630, Col 0)
async function DB(A, q) {
    let K = yF6(A, q);
    try {
        let Y = await H84(K, "utf-8"),
            z = i1(Y),
            _ = zN9().safeParse(z);
        if (!_.success) return k(`[Tasks] Task ${q} failed schema validation: ${_.error.message}`), null;
        return _.data
    } catch (Y) {
        if (Y.code === "ENOENT") return null;
        return k(`[Tasks] Failed to read task ${q}: ${_1(Y)}`), _6(Y), null
    }
}
// @from(Ln 219643, Col 0)
async function WI(A, q, K) {
    let Y = await DB(A, q);
    if (!Y) return null;
    let z = {
            ...Y,
            ...K,
            id: q
        },
        _ = yF6(A, q);
    return await iD1(_, B6(z, null, 2)), Gt(), z
}
// @from(Ln 219654, Col 0)
async function sD1(A, q) {
    let K = yF6(A, q);
    try {
        let Y = parseInt(q, 10);
        if (!isNaN(Y)) {
            let _ = await zT8(A);
            if (Y > _) await P84(A, Y)
        }
        try {
            await j84(K)
        } catch (_) {
            if (_.code === "ENOENT") return !1;
            throw _
        }
        let z = await DX(A);
        for (let _ of z) {
            let w = _.blocks.filter(($) => $ !== q),
                O = _.blockedBy.filter(($) => $ !== q);
            if (w.length !== _.blocks.length || O.length !== _.blockedBy.length) await WI(A, _.id, {
                blocks: w,
                blockedBy: O
            })
        }
        return Gt(), !0
    } catch {
        return !1
    }
}
// @from(Ln 219682, Col 0)
async function DX(A) {
    let q = wR(A),
        K;
    try {
        K = await YT8(q)
    } catch {
        return []
    }
    let Y = K.filter((_) => _.endsWith(".json")).map((_) => _.replace(".json", ""));
    return (await Promise.all(Y.map((_) => DB(A, _)))).filter((_) => _ !== null)
}
// @from(Ln 219693, Col 0)
async function _T8(A, q, K) {
    let [Y, z] = await Promise.all([DB(A, q), DB(A, K)]);
    if (!Y || !z) return !1;
    if (!Y.blocks.includes(K)) await WI(A, q, {
        blocks: [...Y.blocks, K]
    });
    if (!z.blockedBy.includes(q)) await WI(A, K, {
        blockedBy: [...z.blockedBy, q]
    });
    return !0
}
// @from(Ln 219705, Col 0)
function ON9(A) {
    return kF6(wR(A), ".lock")
}
// @from(Ln 219708, Col 0)
async function wT8(A) {
    await oD1(A);
    let q = ON9(A);
    try {
        await iD1(q, "", {
            flag: "wx"
        })
    } catch {}
    return q
}
// @from(Ln 219718, Col 0)
async function OT8(A, q, K, Y = {}) {
    let z = yF6(A, q);
    if (!await DB(A, q)) return {
        success: !1,
        reason: "task_not_found"
    };
    if (Y.checkAgentBusy) return $N9(A, q, K);
    let w;
    try {
        w = await EF6.lock(z, nD1);
        let O = await DB(A, q);
        if (!O) return {
            success: !1,
            reason: "task_not_found"
        };
        if (O.owner && O.owner !== K) return {
            success: !1,
            reason: "already_claimed",
            task: O
        };
        if (O.status === "completed") return {
            success: !1,
            reason: "already_resolved",
            task: O
        };
        let $ = await DX(A),
            H = new Set($.filter((M) => M.status !== "completed").map((M) => M.id)),
            j = O.blockedBy.filter((M) => H.has(M));
        if (j.length > 0) return {
            success: !1,
            reason: "blocked",
            task: O,
            blockedByTasks: j
        };
        return {
            success: !0,
            task: await WI(A, q, {
                owner: K
            })
        }
    } catch (O) {
        return k(`[Tasks] Failed to claim task ${q}: ${_1(O)}`), _6(O), {
            success: !1,
            reason: "task_not_found"
        }
    } finally {
        if (w) await w()
    }
}
// @from(Ln 219767, Col 0)
async function $N9(A, q, K) {
    let Y = await wT8(A),
        z;
    try {
        z = await EF6.lock(Y, nD1);
        let _ = await DX(A),
            w = _.find((J) => J.id === q);
        if (!w) return {
            success: !1,
            reason: "task_not_found"
        };
        if (w.owner && w.owner !== K) return {
            success: !1,
            reason: "already_claimed",
            task: w
        };
        if (w.status === "completed") return {
            success: !1,
            reason: "already_resolved",
            task: w
        };
        let O = new Set(_.filter((J) => J.status !== "completed").map((J) => J.id)),
            $ = w.blockedBy.filter((J) => O.has(J));
        if ($.length > 0) return {
            success: !1,
            reason: "blocked",
            task: w,
            blockedByTasks: $
        };
        let H = _.filter((J) => J.status !== "completed" && J.owner === K && J.id !== q);
        if (H.length > 0) return {
            success: !1,
            reason: "agent_busy",
            task: w,
            busyWithTasks: H.map((J) => J.id)
        };
        return {
            success: !0,
            task: await WI(A, q, {
                owner: K
            })
        }
    } catch (_) {
        return k(`[Tasks] Failed to claim task ${q} with busy check: ${_1(_)}`), _6(_), {
            success: !1,
            reason: "task_not_found"
        }
    } finally {
        if (z) await z()
    }
}
// @from(Ln 219818, Col 0)
async function ft(A, q, K, Y) {
    let _ = (await DX(A)).filter(($) => $.status !== "completed" && ($.owner === q || $.owner === K));
    for (let $ of _) await WI(A, $.id, {
        owner: void 0,
        status: "pending"
    });
    if (_.length > 0) k(`[Tasks] Unassigned ${_.length} task(s) from ${K}`);
    let O = `${K} ${Y==="terminated"?"was terminated":"has shut down"}.`;
    if (_.length > 0) {
        let $ = _.map((H) => `#${H.id} "${H.subject}"`).join(", ");
        O += ` ${_.length} task(s) were unassigned: ${$}. Use TaskList to check availability and TaskUpdate with owner to reassign them to idle teammates.`
    }
    return {
        unassignedTasks: _.map(($) => ({
            id: $.id,
            subject: $.subject
        })),
        notificationMessage: O
    }
}
// @from(Ln 219838, Col 4)
EF6
// @from(Ln 219838, Col 9)
lD1
// @from(Ln 219838, Col 14)
VF6
// @from(Ln 219838, Col 19)
H36
// @from(Ln 219838, Col 24)
zN9
// @from(Ln 219838, Col 29)
_N9 = ".highwatermark"
// @from(Ln 219839, Col 4)
nD1
// @from(Ln 219839, Col 9)
$T8 = "tasklist"
// @from(Ln 219840, Col 4)
Bw = E(() => {
    A8();
    T1();
    A8();
    K7();
    k1();
    H1();
    g1();
    zz();
    qZ();
    s8();
    EF6 = t(nx(), 1), lD1 = new Set;
    H36 = F6(() => C.enum(["pending", "in_progress", "completed"])), zN9 = F6(() => C.object({
        id: C.string(),
        subject: C.string(),
        description: C.string(),
        activeForm: C.string().optional(),
        owner: C.string().optional(),
        status: H36(),
        blocks: C.array(C.string()),
        blockedBy: C.array(C.string()),
        metadata: C.record(C.string(), C.unknown()).optional()
    })), nD1 = {
        retries: {
            retries: 10,
            minTimeout: 5,
            maxTimeout: 100
        }
    }
})
// @from(Ln 219870, Col 4)
HN9
// @from(Ln 219870, Col 9)
jN9
// @from(Ln 219870, Col 14)
xv
// @from(Ln 219871, Col 4)
R06 = E(() => {
    K7();
    Y84();
    tf8();
    T1();
    Bw();
    HA();
    HN9 = F6(() => C.strictObject({
        todos: y06().describe("The updated todo list")
    })), jN9 = F6(() => C.object({
        oldTodos: y06().describe("The todo list before the update"),
        newTodos: y06().describe("The todo list after the update"),
        verificationNudgeNeeded: C.boolean().optional()
    })), xv = {
        name: MB,
        searchHint: "manage the session task checklist",
        maxResultSizeChars: 1e5,
        strict: !0,
        input_examples: [{
            todos: [{
                content: "Fix the login bug",
                status: "pending",
                activeForm: "Fixing the login bug"
            }]
        }, {
            todos: [{
                content: "Implement feature",
                status: "completed",
                activeForm: "Implementing feature"
            }, {
                content: "Write unit tests",
                status: "in_progress",
                activeForm: "Writing unit tests"
            }]
        }],
        async description() {
            return K84
        },
        async prompt() {
            return q84
        },
        get inputSchema() {
            return HN9()
        },
        get outputSchema() {
            return jN9()
        },
        userFacingName() {
            return ""
        },
        shouldDefer: !0,
        isEnabled() {
            return !r$()
        },
        isConcurrencySafe() {
            return !1
        },
        isReadOnly() {
            return !1
        },
        toAutoClassifierInput(A) {
            return `${A.todos.length} items`
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: z84,
        renderToolUseProgressMessage: _84,
        renderToolUseRejectedMessage: w84,
        renderToolUseErrorMessage: O84,
        renderToolResultMessage: $84,
        async call({
            todos: A
        }, q) {
            let K = q.getAppState(),
                Y = q.agentId ?? R1(),
                z = K.todos[Y] ?? [],
                w = A.every(($) => $.status === "completed") ? [] : A,
                O = !1;
            return q.setAppState(($) => ({
                ...$,
                todos: {
                    ...$.todos,
                    [Y]: w
                }
            })), {
                data: {
                    oldTodos: z,
                    newTodos: A,
                    verificationNudgeNeeded: O
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            verificationNudgeNeeded: A
        }, q) {
            let Y = A ? `

NOTE: You just closed out 3+ tasks and none of them was a verification step. Before writing your final summary, spawn the verification agent (subagent_type="${R31}"). You cannot self-assign PARTIAL by listing caveats in your summary — only the verifier issues a verdict.` : "";
            return {
                tool_use_id: q,
                type: "tool_result",
                content: "Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable" + Y
            }
        }
    }
})
// @from(Ln 219982, Col 0)
function Sd(A, q = "append") {
    if (A.length > 0) {
        if (HT8 && OR.length > 0)
            if (q === "prepend") OR[0] = A + OR[0];
            else OR[0] = OR[0] + A;
        else if (OR.unshift(A), OR.length > JN9) OR.pop();
        HT8 = !0, AX1 = !1
    }
}
// @from(Ln 219992, Col 0)
function qX1() {
    return OR[0] ?? ""
}
// @from(Ln 219996, Col 0)
function RF6() {
    HT8 = !1
}
// @from(Ln 220000, Col 0)
function KX1(A, q) {
    Z84 = A, jT8 = q, AX1 = !0, tD1 = 0
}
// @from(Ln 220004, Col 0)
function YX1() {
    if (!AX1 || OR.length <= 1) return null;
    return tD1 = (tD1 + 1) % OR.length, {
        text: OR[tD1] ?? "",
        start: Z84,
        length: jT8
    }
}
// @from(Ln 220013, Col 0)
function zX1(A) {
    jT8 = A
}
// @from(Ln 220017, Col 0)
function hF6() {
    AX1 = !1
}