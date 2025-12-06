
// @from(Start 9980327, End 9981001)
function t00(A) {
  let Q = A.resetsAt ? ` · resets ${g3A(A.resetsAt,!0)}` : "";
  if (A.rateLimitType === "five_hour") return `5-hour limit reached${Q} · now using extra usage`;
  if (A.rateLimitType === "seven_day") return `Weekly limit reached${Q} · now using extra usage`;
  if (A.rateLimitType === "seven_day_opus") return `Opus weekly limit reached${Q} · now using extra usage`;
  if (A.rateLimitType === "seven_day_sonnet") {
    let B = f4();
    if (B === "pro" || B === "enterprise") return `Weekly limit reached${Q} · now using extra usage`;
    return `Sonnet weekly limit reached${Q} · now using extra usage · /model opus`
  }
  return "Now using extra usage"
}
// @from(Start 9981003, End 9982103)
function MYA(A, Q, B) {
  let G = f4(),
    Z = G === "team" || G === "enterprise",
    I = G === "pro",
    Y = G === "max",
    J = A === "Sonnet weekly limit",
    W = t6()?.hasExtraUsageEnabled === !0,
    X = "";
  if (I)
    if (KT(B) && o2("tengu_backstage_only"))
      if (W) X = "add funds to continue with extra usage";
      else X = "turn on /extra-usage";
  else X = `/upgrade to Max or ${W?"add funds to continue with extra usage":"turn on /extra-usage"}`;
  else if (Y)
    if (yc() === "default_claude_max_20x")
      if (J) X = "/model opus or turn on /extra-usage";
      else X = W ? "add funds to continue with extra usage" : "turn on /extra-usage";
  else if (J) X = `/model opus, /upgrade to Max 20x or ${W?"add funds to continue with extra usage":"turn on /extra-usage"}`;
  else X = `/upgrade to Max 20x or ${W?"add funds to continue with extra usage":"turn on /extra-usage"}`;
  else if (Z)
    if (J) X = "/model opus or contact an admin to increase limits";
    else X = "contact an admin to increase limits";
  let V = `${A} reached${Q}`;
  return X ? `${V} · ${X}` : V
}
// @from(Start 9982108, End 9982111)
KD5
// @from(Start 9982117, End 9982451)
e00 = L(() => {
  gB();
  t2();
  u2();
  KD5 = ["Limit reached", "Sonnet weekly limit reached", "Opus weekly limit reached", "Weekly limit reached", "5-hour limit reached", "Usage limit reached", "You've hit your", "Approaching spending cap", "Approaching Opus weekly limit", "Approaching weekly limit", "Approaching usage limit"]
})
// @from(Start 9982454, End 9982576)
function ED5(A, Q) {
  let B = Date.now() / 1000,
    G = A - Q,
    Z = B - G;
  return Math.max(0, Math.min(1, Z / Q))
}
// @from(Start 9982578, End 9982885)
function U91(A) {
  ik = A, AQ0.forEach((B) => B(A));
  let Q = Math.round((A.resetsAt ? A.resetsAt - Date.now() / 1000 : 0) / 3600);
  GA("tengu_claudeai_limits_status_changed", {
    status: A.status,
    unifiedRateLimitFallbackAvailable: A.unifiedRateLimitFallbackAvailable,
    hoursTillReset: Q
  })
}
// @from(Start 9982886, End 9983238)
async function zD5() {
  let A = MW(),
    Q = await Kq({
      maxRetries: 0,
      model: A
    }),
    B = [{
      role: "user",
      content: "quota"
    }],
    G = Dw(A);
  return Q.beta.messages.create({
    model: A,
    max_tokens: 1,
    messages: B,
    metadata: Rl(),
    ...G.length > 0 ? {
      betas: G
    } : {}
  }).asResponse()
}
// @from(Start 9983239, End 9983393)
async function TI2() {
  if (!LYA(BB())) return;
  try {
    let A = await zD5();
    QQ0(A.headers)
  } catch (A) {
    if (A instanceof n2) BQ0(A)
  }
}
// @from(Start 9983395, End 9983619)
function w91() {
  let [A, Q] = $91.useState({
    ...ik
  });
  return $91.useEffect(() => {
    let B = (G) => {
      Q({
        ...G
      })
    };
    return AQ0.add(B), () => {
      AQ0.delete(B)
    }
  }, []), A
}
// @from(Start 9983621, End 9984204)
function UD5(A, Q, B) {
  let {
    rateLimitType: G,
    claimAbbrev: Z,
    windowSeconds: I,
    thresholds: Y
  } = Q, J = A.get(`anthropic-ratelimit-unified-${Z}-utilization`), W = A.get(`anthropic-ratelimit-unified-${Z}-reset`);
  if (J === null || W === null) return null;
  let X = Number(J),
    V = Number(W),
    F = ED5(V, I);
  if (!Y.some((D) => X >= D.utilization && F <= D.timePct)) return null;
  return {
    status: "allowed_warning",
    resetsAt: V,
    rateLimitType: G,
    utilization: X,
    unifiedRateLimitFallbackAvailable: B,
    isUsingOverage: !1
  }
}
// @from(Start 9984206, End 9985153)
function PI2(A) {
  let Q = A.get("anthropic-ratelimit-unified-status") || "allowed",
    B = A.get("anthropic-ratelimit-unified-reset"),
    G = B ? Number(B) : void 0,
    Z = A.get("anthropic-ratelimit-unified-fallback") === "available",
    I = A.get("anthropic-ratelimit-unified-representative-claim"),
    Y = A.get("anthropic-ratelimit-unified-overage-status"),
    J = A.get("anthropic-ratelimit-unified-overage-reset"),
    W = J ? Number(J) : void 0,
    X = Q === "rejected" && (Y === "allowed" || Y === "allowed_warning"),
    V = Q;
  if (Q === "allowed" || Q === "allowed_warning") {
    for (let F of CD5) {
      let K = UD5(A, F, Z);
      if (K) return K
    }
    V = "allowed"
  }
  return {
    status: V,
    resetsAt: G,
    unifiedRateLimitFallbackAvailable: Z,
    ...I && {
      rateLimitType: I
    },
    ...Y && {
      overageStatus: Y
    },
    ...W && {
      overageResetsAt: W
    },
    isUsingOverage: X
  }
}
// @from(Start 9985155, End 9985439)
function QQ0(A) {
  let Q = BB();
  if (!LYA(Q)) {
    if (ik.status !== "allowed" || ik.resetsAt) U91({
      status: "allowed",
      unifiedRateLimitFallbackAvailable: !1,
      isUsingOverage: !1
    });
    return
  }
  let B = s00(A),
    G = PI2(B);
  if (!HH1(ik, G)) U91(G)
}
// @from(Start 9985441, End 9985702)
function BQ0(A) {
  if (!LYA(BB()) || A.status !== 429) return;
  try {
    let Q = {
      ...ik
    };
    if (A.headers) {
      let B = s00(A.headers);
      Q = PI2(B)
    }
    if (Q.status = "rejected", !HH1(ik, Q)) U91(Q)
  } catch (Q) {
    AA(Q)
  }
}
// @from(Start 9985707, End 9985710)
$91
// @from(Start 9985712, End 9985715)
CD5
// @from(Start 9985717, End 9985719)
ik
// @from(Start 9985721, End 9985724)
AQ0
// @from(Start 9985730, End 9986409)
Pi = L(() => {
  oZA();
  g1();
  t2();
  q0();
  gB();
  CS();
  p_();
  fZ();
  yu0();
  mMA();
  e00();
  $91 = BA(VA(), 1), CD5 = [{
    rateLimitType: "five_hour",
    claimAbbrev: "5h",
    windowSeconds: 18000,
    thresholds: [{
      utilization: 0.9,
      timePct: 0.72
    }]
  }, {
    rateLimitType: "seven_day",
    claimAbbrev: "7d",
    windowSeconds: 604800,
    thresholds: [{
      utilization: 0.75,
      timePct: 0.6
    }, {
      utilization: 0.5,
      timePct: 0.35
    }, {
      utilization: 0.25,
      timePct: 0.15
    }]
  }];
  ik = {
    status: "allowed",
    unifiedRateLimitFallbackAvailable: !1,
    isUsingOverage: !1
  }, AQ0 = new Set
})
// @from(Start 9986412, End 9989688)
function LD5(A, Q, B) {
  try {
    let G = -1;
    for (let J = 0; J < B.length; J++) {
      let W = B[J];
      if (!W) continue;
      let X = W.message.content;
      if (Array.isArray(X)) {
        for (let V of X)
          if (V.type === "tool_use" && "id" in V && V.id === A) {
            G = J;
            break
          }
      }
      if (G !== -1) break
    }
    let Z = -1;
    for (let J = 0; J < Q.length; J++) {
      let W = Q[J];
      if (!W) continue;
      if (W.type === "assistant" && "message" in W) {
        let X = W.message.content;
        if (Array.isArray(X)) {
          for (let V of X)
            if (V.type === "tool_use" && "id" in V && V.id === A) {
              Z = J;
              break
            }
        }
      }
      if (Z !== -1) break
    }
    let I = [];
    for (let J = G + 1; J < B.length; J++) {
      let W = B[J];
      if (!W) continue;
      let X = W.message.content;
      if (Array.isArray(X))
        for (let V of X) {
          let F = W.message.role;
          if (V.type === "tool_use" && "id" in V) I.push(`${F}:tool_use:${V.id}`);
          else if (V.type === "tool_result" && "tool_use_id" in V) I.push(`${F}:tool_result:${V.tool_use_id}`);
          else if (V.type === "text") I.push(`${F}:text`);
          else if (V.type === "thinking") I.push(`${F}:thinking`);
          else if (V.type === "image") I.push(`${F}:image`);
          else I.push(`${F}:${V.type}`)
        } else if (typeof X === "string") I.push(`${W.message.role}:string_content`)
    }
    let Y = [];
    for (let J = Z + 1; J < Q.length; J++) {
      let W = Q[J];
      if (!W) continue;
      switch (W.type) {
        case "user":
        case "assistant": {
          if ("message" in W) {
            let X = W.message.content;
            if (Array.isArray(X))
              for (let V of X) {
                let F = W.message.role;
                if (V.type === "tool_use" && "id" in V) Y.push(`${F}:tool_use:${V.id}`);
                else if (V.type === "tool_result" && "tool_use_id" in V) Y.push(`${F}:tool_result:${V.tool_use_id}`);
                else if (V.type === "text") Y.push(`${F}:text`);
                else if (V.type === "thinking") Y.push(`${F}:thinking`);
                else if (V.type === "image") Y.push(`${F}:image`);
                else Y.push(`${F}:${V.type}`)
              } else if (typeof X === "string") Y.push(`${W.message.role}:string_content`)
          }
          break
        }
        case "attachment":
          if ("attachment" in W) Y.push(`attachment:${W.attachment.type}`);
          break;
        case "system":
          if ("subtype" in W) Y.push(`system:${W.subtype}`);
          break;
        case "progress":
          if ("progress" in W && W.progress && typeof W.progress === "object" && "type" in W.progress) Y.push(`progress:${W.progress.type??"unknown"}`);
          else Y.push("progress:unknown");
          break
      }
    }
    GA("tengu_tool_use_tool_result_mismatch_error", {
      toolUseId: A,
      normalizedSequence: I.join(", "),
      preNormalizedSequence: Y.join(", "),
      normalizedMessageCount: B.length,
      originalMessageCount: Q.length,
      normalizedToolUseIndex: G,
      originalToolUseIndex: Z
    })
  } catch (G) {}
}
// @from(Start 9989690, End 9993899)
function ZQ0(A, Q, B) {
  if (A instanceof IS || A instanceof cC && A.message.toLowerCase().includes("timeout")) return KY({
    content: O91,
    error: "unknown"
  });
  if (A instanceof Error && A.message.includes(j1A)) return KY({
    content: j1A,
    error: "rate_limit"
  });
  if (A instanceof n2 && A.status === 429 && LYA(BB())) {
    let G = A.headers?.get?.("anthropic-ratelimit-unified-representative-claim"),
      Z = A.headers?.get?.("anthropic-ratelimit-unified-overage-status");
    if (G || Z) {
      let I = {
          status: "rejected",
          unifiedRateLimitFallbackAvailable: !1,
          isUsingOverage: !1
        },
        Y = A.headers?.get?.("anthropic-ratelimit-unified-reset");
      if (Y) I.resetsAt = Number(Y);
      if (G) I.rateLimitType = G;
      if (Z) I.overageStatus = Z;
      let J = A.headers?.get?.("anthropic-ratelimit-unified-overage-reset");
      if (J) I.overageResetsAt = Number(J);
      let W = r00(I, Q);
      if (W) return KY({
        content: W,
        error: "rate_limit"
      });
      return KY({
        content: S1A,
        error: "rate_limit"
      })
    }
    return KY({
      content: `${uV}: Rate limit reached`,
      error: "rate_limit"
    })
  }
  if (A instanceof Error && A.message.includes("prompt is too long")) return KY({
    content: OYA,
    error: "invalid_request"
  });
  if (A instanceof Error && /maximum of \d+ PDF pages/.test(A.message)) return KY({
    content: $D5,
    error: "invalid_request"
  });
  if (A instanceof Error && A.message.includes("The PDF specified is password protected")) return KY({
    content: wD5,
    error: "invalid_request"
  });
  if (A instanceof n2 && A.status === 400 && A.message.includes("image exceeds") && A.message.includes("maximum")) return KY({
    content: qD5
  });
  if (A instanceof n2 && A.status === 400 && A.message.includes("`tool_use` ids were found without `tool_result` blocks immediately after")) {
    if (B?.messages && B?.messagesForAPI) {
      let G = A.message.match(/toolu_[a-zA-Z0-9]+/),
        Z = G ? G[0] : null;
      if (Z) LD5(Z, B.messages, B.messagesForAPI)
    } {
      let Z = N6() ? "" : " Run /rewind to recover the conversation.";
      return KY({
        content: "API Error: 400 due to tool use concurrency issues." + Z,
        error: "invalid_request"
      })
    }
  }
  if (A instanceof n2 && A.status === 400 && A.message.includes("unexpected `tool_use_id` found in `tool_result`")) GA("tengu_unexpected_tool_result", {});
  if (BB() && A instanceof n2 && A.status === 400 && A.message.toLowerCase().includes("invalid model name") && (W7A(Q) || Q === "opus")) return KY({
    content: "Claude Opus is not available with the Claude Pro plan. If you have updated your subscription plan recently, run /logout and /login for the plan to take effect.",
    error: "invalid_request"
  });
  if (A instanceof Error && A.message.includes("Your credit balance is too low")) return KY({
    content: q91,
    error: "billing_error"
  });
  if (A instanceof Error && A.message.toLowerCase().includes("x-api-key")) {
    let {
      source: G
    } = cw();
    return KY({
      error: "authentication_failed",
      content: G === "ANTHROPIC_API_KEY" || G === "apiKeyHelper" ? L91 : N91
    })
  }
  if (A instanceof n2 && A.status === 403 && A.message.includes("OAuth token has been revoked")) return KY({
    error: "authentication_failed",
    content: M91
  });
  if (A instanceof n2 && (A.status === 401 || A.status === 403) && A.message.includes("OAuth authentication is currently not allowed for this organization")) return KY({
    error: "authentication_failed",
    content: ND5
  });
  if (A instanceof n2 && (A.status === 401 || A.status === 403)) return KY({
    error: "authentication_failed",
    content: `${uV}: ${A.message} · Please run /login`
  });
  if (Y0(process.env.CLAUDE_CODE_USE_BEDROCK) && A instanceof Error && A.message.toLowerCase().includes("model id")) return KY({
    content: `${uV} (${Q}): ${A.message}`,
    error: "invalid_request"
  });
  if (A instanceof Error) return KY({
    content: `${uV}: ${A.message}`,
    error: "unknown"
  });
  return KY({
    content: uV,
    error: "unknown"
  })
}
// @from(Start 9993901, End 9996245)
function jI2(A) {
  if (A instanceof IS || A instanceof cC && A.message.toLowerCase().includes("timeout")) return "api_timeout";
  if (A instanceof Error && A.message.includes(GQ0)) return "repeated_529";
  if (A instanceof Error && A.message.includes(j1A)) return "capacity_off_switch";
  if (A instanceof n2 && A.status === 429) return "rate_limit";
  if (A instanceof n2 && (A.status === 529 || A.message?.includes('"type":"overloaded_error"'))) return "server_overload";
  if (A instanceof Error && A.message.toLowerCase().includes(OYA.toLowerCase())) return "prompt_too_long";
  if (A instanceof Error && /maximum of \d+ PDF pages/.test(A.message)) return "pdf_too_large";
  if (A instanceof Error && A.message.includes("The PDF specified is password protected")) return "pdf_password_protected";
  if (A instanceof n2 && A.status === 400 && A.message.includes("image exceeds") && A.message.includes("maximum")) return "image_too_large";
  if (A instanceof n2 && A.status === 400 && A.message.includes("`tool_use` ids were found without `tool_result` blocks immediately after")) return "tool_use_mismatch";
  if (A instanceof n2 && A.status === 400 && A.message.includes("unexpected `tool_use_id` found in `tool_result`")) return "unexpected_tool_result";
  if (A instanceof n2 && A.status === 400 && A.message.toLowerCase().includes("invalid model name")) return "invalid_model";
  if (A instanceof Error && A.message.toLowerCase().includes(q91.toLowerCase())) return "credit_balance_low";
  if (A instanceof Error && A.message.toLowerCase().includes("x-api-key")) return "invalid_api_key";
  if (A instanceof n2 && A.status === 403 && A.message.includes("OAuth token has been revoked")) return "token_revoked";
  if (A instanceof n2 && (A.status === 401 || A.status === 403) && A.message.includes("OAuth authentication is currently not allowed for this organization")) return "oauth_org_not_allowed";
  if (A instanceof n2 && (A.status === 401 || A.status === 403)) return "auth_error";
  if (Y0(process.env.CLAUDE_CODE_USE_BEDROCK) && A instanceof Error && A.message.toLowerCase().includes("model id")) return "bedrock_model_access";
  if (A instanceof n2) {
    let Q = A.status;
    if (Q >= 500) return "server_error";
    if (Q >= 400) return "client_error"
  }
  if (A instanceof cC) return "connection_error";
  return "unknown"
}
// @from(Start 9996247, End 9996829)
function SI2(A, Q) {
  if (A !== "refusal") return;
  GA("tengu_refusal_api_response", {});
  let B = `${uV}: Claude Code is unable to respond to this request, which appears to violate our Usage Policy (https://www.anthropic.com/legal/aup). Please double press esc to edit your last message or start a new session for Claude Code to assist with a different task.`;
  return KY({
    content: B + (Q !== "claude-sonnet-4-20250514" ? " If you are seeing this refusal repeatedly, try running /model claude-sonnet-4-20250514 to switch models." : ""),
    error: "invalid_request"
  })
}
// @from(Start 9996834, End 9996850)
uV = "API Error"
// @from(Start 9996854, End 9996880)
OYA = "Prompt is too long"
// @from(Start 9996884, End 9996917)
q91 = "Credit balance is too low"
// @from(Start 9996921, End 9996964)
N91 = "Invalid API key · Please run /login"
// @from(Start 9996968, End 9997014)
L91 = "Invalid API key · Fix external API key"
// @from(Start 9997018, End 9997037)
$q = "(no content)"
// @from(Start 9997041, End 9997088)
M91 = "OAuth token revoked · Please run /login"
// @from(Start 9997092, End 9997130)
GQ0 = "Repeated 529 Overloaded errors"
// @from(Start 9997134, End 9997211)
j1A = "Opus is experiencing high load, please use /model to switch to Sonnet"
// @from(Start 9997215, End 9997240)
O91 = "Request timed out"
// @from(Start 9997244, End 9997326)
$D5 = "PDF too large. Please double press esc to edit your message and try again."
// @from(Start 9997330, End 9997424)
wD5 = "PDF is password protected. Please double press esc to edit your message and try again."
// @from(Start 9997428, End 9997520)
qD5 = "Image was too large. Double press esc to go back and try again with a smaller image."
// @from(Start 9997524, End 9997600)
ND5 = "Your account does not have access to Claude Code. Please run /login."
// @from(Start 9997606, End 9997695)
ZO = L(() => {
  p_();
  gB();
  cQ();
  t2();
  q0();
  Pi();
  mMA();
  hQ();
  _0()
})
// @from(Start 9997698, End 10007856)
function R91(A) {
  if (!A || A.trim() === "") return `Your task is to create a detailed summary of the conversation so far, paying close attention to the user's explicit requests and your previous actions.
This summary should be thorough in capturing technical details, code patterns, and architectural decisions that would be essential for continuing development work without losing context.

Before providing your final summary, wrap your analysis in <analysis> tags to organize your thoughts and ensure you've covered all necessary points. In your analysis process:

1. Chronologically analyze each message and section of the conversation. For each section thoroughly identify:
   - The user's explicit requests and intents
   - Your approach to addressing the user's requests
   - Key decisions, technical concepts and code patterns
   - Specific details like:
     - file names
     - full code snippets
     - function signatures
     - file edits
  - Errors that you ran into and how you fixed them
  - Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
2. Double-check for technical accuracy and completeness, addressing each required element thoroughly.

Your summary should include the following sections:

1. Primary Request and Intent: Capture all of the user's explicit requests and intents in detail
2. Key Technical Concepts: List all important technical concepts, technologies, and frameworks discussed.
3. Files and Code Sections: Enumerate specific files and code sections examined, modified, or created. Pay special attention to the most recent messages and include full code snippets where applicable and include a summary of why this file read or edit is important.
4. Errors and fixes: List all errors that you ran into, and how you fixed them. Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
5. Problem Solving: Document problems solved and any ongoing troubleshooting efforts.
6. All user messages: List ALL user messages that are not tool results. These are critical for understanding the users' feedback and changing intent.
6. Pending Tasks: Outline any pending tasks that you have explicitly been asked to work on.
7. Current Work: Describe in detail precisely what was being worked on immediately before this summary request, paying special attention to the most recent messages from both user and assistant. Include file names and code snippets where applicable.
8. Optional Next Step: List the next step that you will take that is related to the most recent work you were doing. IMPORTANT: ensure that this step is DIRECTLY in line with the user's most recent explicit requests, and the task you were working on immediately before this summary request. If your last task was concluded, then only list next steps if they are explicitly in line with the users request. Do not start on tangential requests or really old requests that were already completed without confirming with the user first.
                       If there is a next step, include direct quotes from the most recent conversation showing exactly what task you were working on and where you left off. This should be verbatim to ensure there's no drift in task interpretation.

Here's an example of how your output should be structured:

<example>
<analysis>
[Your thought process, ensuring all points are covered thoroughly and accurately]
</analysis>

<summary>
1. Primary Request and Intent:
   [Detailed description]

2. Key Technical Concepts:
   - [Concept 1]
   - [Concept 2]
   - [...]

3. Files and Code Sections:
   - [File Name 1]
      - [Summary of why this file is important]
      - [Summary of the changes made to this file, if any]
      - [Important Code Snippet]
   - [File Name 2]
      - [Important Code Snippet]
   - [...]

4. Errors and fixes:
    - [Detailed description of error 1]:
      - [How you fixed the error]
      - [User feedback on the error if any]
    - [...]

5. Problem Solving:
   [Description of solved problems and ongoing troubleshooting]

6. All user messages: 
    - [Detailed non tool use user message]
    - [...]

7. Pending Tasks:
   - [Task 1]
   - [Task 2]
   - [...]

8. Current Work:
   [Precise description of current work]

9. Optional Next Step:
   [Optional Next step to take]

</summary>
</example>

Please provide your summary based on the conversation so far, following this structure and ensuring precision and thoroughness in your response. 

There may be additional summarization instructions provided in the included context. If so, remember to follow these instructions when creating the above summary. Examples of instructions include:
<example>
## Compact Instructions
When summarizing the conversation focus on typescript code changes and also remember the mistakes you made and how you fixed them.
</example>

<example>
# Summary instructions
When you are using compact - please focus on test output and code changes. Include file reads verbatim.
</example>
`;
  return `Your task is to create a detailed summary of the conversation so far, paying close attention to the user's explicit requests and your previous actions.
This summary should be thorough in capturing technical details, code patterns, and architectural decisions that would be essential for continuing development work without losing context.

Before providing your final summary, wrap your analysis in <analysis> tags to organize your thoughts and ensure you've covered all necessary points. In your analysis process:

1. Chronologically analyze each message and section of the conversation. For each section thoroughly identify:
   - The user's explicit requests and intents
   - Your approach to addressing the user's requests
   - Key decisions, technical concepts and code patterns
   - Specific details like:
     - file names
     - full code snippets
     - function signatures
     - file edits
  - Errors that you ran into and how you fixed them
  - Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
2. Double-check for technical accuracy and completeness, addressing each required element thoroughly.

Your summary should include the following sections:

1. Primary Request and Intent: Capture all of the user's explicit requests and intents in detail
2. Key Technical Concepts: List all important technical concepts, technologies, and frameworks discussed.
3. Files and Code Sections: Enumerate specific files and code sections examined, modified, or created. Pay special attention to the most recent messages and include full code snippets where applicable and include a summary of why this file read or edit is important.
4. Errors and fixes: List all errors that you ran into, and how you fixed them. Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
5. Problem Solving: Document problems solved and any ongoing troubleshooting efforts.
6. All user messages: List ALL user messages that are not tool results. These are critical for understanding the users' feedback and changing intent.
6. Pending Tasks: Outline any pending tasks that you have explicitly been asked to work on.
7. Current Work: Describe in detail precisely what was being worked on immediately before this summary request, paying special attention to the most recent messages from both user and assistant. Include file names and code snippets where applicable.
8. Optional Next Step: List the next step that you will take that is related to the most recent work you were doing. IMPORTANT: ensure that this step is DIRECTLY in line with the user's most recent explicit requests, and the task you were working on immediately before this summary request. If your last task was concluded, then only list next steps if they are explicitly in line with the users request. Do not start on tangential requests or really old requests that were already completed without confirming with the user first.
                       If there is a next step, include direct quotes from the most recent conversation showing exactly what task you were working on and where you left off. This should be verbatim to ensure there's no drift in task interpretation.

Here's an example of how your output should be structured:

<example>
<analysis>
[Your thought process, ensuring all points are covered thoroughly and accurately]
</analysis>

<summary>
1. Primary Request and Intent:
   [Detailed description]

2. Key Technical Concepts:
   - [Concept 1]
   - [Concept 2]
   - [...]

3. Files and Code Sections:
   - [File Name 1]
      - [Summary of why this file is important]
      - [Summary of the changes made to this file, if any]
      - [Important Code Snippet]
   - [File Name 2]
      - [Important Code Snippet]
   - [...]

4. Errors and fixes:
    - [Detailed description of error 1]:
      - [How you fixed the error]
      - [User feedback on the error if any]
    - [...]

5. Problem Solving:
   [Description of solved problems and ongoing troubleshooting]

6. All user messages: 
    - [Detailed non tool use user message]
    - [...]

7. Pending Tasks:
   - [Task 1]
   - [Task 2]
   - [...]

8. Current Work:
   [Precise description of current work]

9. Optional Next Step:
   [Optional Next step to take]

</summary>
</example>

Please provide your summary based on the conversation so far, following this structure and ensuring precision and thoroughness in your response. 

There may be additional summarization instructions provided in the included context. If so, remember to follow these instructions when creating the above summary. Examples of instructions include:
<example>
## Compact Instructions
When summarizing the conversation focus on typescript code changes and also remember the mistakes you made and how you fixed them.
</example>

<example>
# Summary instructions
When you are using compact - please focus on test output and code changes. Include file reads verbatim.
</example>


Additional Instructions:
${A}`
}
// @from(Start 10007858, End 10008274)
function MD5(A) {
  let Q = A,
    B = Q.match(/<analysis>([\s\S]*?)<\/analysis>/);
  if (B) {
    let Z = B[1] || "";
    Q = Q.replace(/<analysis>[\s\S]*?<\/analysis>/, `Analysis:
${Z.trim()}`)
  }
  let G = Q.match(/<summary>([\s\S]*?)<\/summary>/);
  if (G) {
    let Z = G[1] || "";
    Q = Q.replace(/<summary>[\s\S]*?<\/summary>/, `Summary:
${Z.trim()}`)
  }
  return Q = Q.replace(/\n\n+/g, `

`), Q.trim()
}
// @from(Start 10008276, End 10008647)
function T91(A, Q) {
  let G = `This session is being continued from a previous conversation that ran out of context. The conversation is summarized below:
${MD5(A)}.`;
  if (Q) return `${G}
Please continue the conversation from where we left it off without asking the user any further questions. Continue with the last task that you were asked to work on.`;
  return G
}
// @from(Start 10008649, End 10008680)
function P91(A, Q) {
  return
}
// @from(Start 10008685, End 10008688)
OD5
// @from(Start 10008690, End 10008693)
RD5
// @from(Start 10008699, End 10008820)
IQ0 = L(() => {
  AQ();
  q0();
  l2();
  OD5 = s1(() => {
    return null
  }), RD5 = s1(() => {
    return null
  })
})
// @from(Start 10008823, End 10008914)
function YQ0(A) {
  if (A === "Local") return "project (local)";
  return A.toLowerCase()
}
// @from(Start 10008919, End 10008922)
_I2
// @from(Start 10008928, End 10009023)
JQ0 = L(() => {
  _I2 = ["User", "Project", "Local", "Managed", "ExperimentalUltraClaudeMd"]
})
// @from(Start 10009026, End 10010108)
function yI2(A) {
  let Q = {
      toolRequests: new Map,
      toolResults: new Map,
      humanMessages: 0,
      assistantMessages: 0,
      localCommandOutputs: 0,
      other: 0,
      attachments: new Map,
      duplicateFileReads: new Map,
      total: 0
    },
    B = new Map,
    G = new Map,
    Z = new Map;
  return A.forEach((Y) => {
    if (Y.type === "attachment") {
      let J = Y.attachment.type || "unknown";
      Q.attachments.set(J, (Q.attachments.get(J) || 0) + 1)
    }
  }), WZ(A).forEach((Y) => {
    let {
      content: J
    } = Y.message;
    if (typeof J === "string") {
      let W = gG(J);
      if (Q.total += W, Y.type === "user" && J.includes("local-command-stdout")) Q.localCommandOutputs += W;
      else Q[Y.type === "user" ? "humanMessages" : "assistantMessages"] += W
    } else J.forEach((W) => TD5(W, Y, Q, B, G, Z))
  }), Z.forEach((Y, J) => {
    if (Y.count > 1) {
      let X = Math.floor(Y.totalTokens / Y.count) * (Y.count - 1);
      Q.duplicateFileReads.set(J, {
        count: Y.count,
        tokens: X
      })
    }
  }), Q
}
// @from(Start 10010110, End 10011747)
function TD5(A, Q, B, G, Z, I) {
  let Y = gG(JSON.stringify(A));
  switch (B.total += Y, A.type) {
    case "text":
      if (Q.type === "user" && "text" in A && A.text.includes("local-command-stdout")) B.localCommandOutputs += Y;
      else B[Q.type === "user" ? "humanMessages" : "assistantMessages"] += Y;
      break;
    case "tool_use": {
      if ("name" in A && "id" in A) {
        let J = A.name || "unknown";
        if (kI2(B.toolRequests, J, Y), G.set(A.id, J), J === "Read" && "input" in A && A.input && typeof A.input === "object" && "file_path" in A.input) {
          let W = String(A.input.file_path);
          Z.set(A.id, W)
        }
      }
      break
    }
    case "tool_result": {
      if ("tool_use_id" in A) {
        let J = G.get(A.tool_use_id) || "unknown";
        if (kI2(B.toolResults, J, Y), J === "Read") {
          let W = Z.get(A.tool_use_id);
          if (W) {
            let X = I.get(W) || {
              count: 0,
              totalTokens: 0
            };
            I.set(W, {
              count: X.count + 1,
              totalTokens: X.totalTokens + Y
            })
          }
        }
      }
      break
    }
    case "image":
    case "server_tool_use":
    case "web_search_tool_result":
    case "search_result":
    case "document":
    case "thinking":
    case "redacted_thinking":
    case "code_execution_tool_result":
    case "mcp_tool_use":
    case "mcp_tool_result":
    case "container_upload":
    case "web_fetch_tool_result":
    case "bash_code_execution_tool_result":
    case "text_editor_code_execution_tool_result":
      B.other += Y;
      break
  }
}
// @from(Start 10011749, End 10011806)
function kI2(A, Q, B) {
  A.set(Q, (A.get(Q) || 0) + B)
}
// @from(Start 10011808, End 10013249)
function xI2(A) {
  let Q = {
    total_tokens: A.total,
    human_message_tokens: A.humanMessages,
    assistant_message_tokens: A.assistantMessages,
    local_command_output_tokens: A.localCommandOutputs,
    other_tokens: A.other
  };
  A.attachments.forEach((G, Z) => {
    Q[`attachment_${Z}_count`] = G
  }), A.toolRequests.forEach((G, Z) => {
    Q[`tool_request_${Z}_tokens`] = G
  }), A.toolResults.forEach((G, Z) => {
    Q[`tool_result_${Z}_tokens`] = G
  });
  let B = [...A.duplicateFileReads.values()].reduce((G, Z) => G + Z.tokens, 0);
  if (Q.duplicate_read_tokens = B, Q.duplicate_read_file_count = A.duplicateFileReads.size, A.total > 0) {
    Q.human_message_percent = Math.round(A.humanMessages / A.total * 100), Q.assistant_message_percent = Math.round(A.assistantMessages / A.total * 100), Q.local_command_output_percent = Math.round(A.localCommandOutputs / A.total * 100), Q.duplicate_read_percent = Math.round(B / A.total * 100);
    let G = [...A.toolRequests.values()].reduce((I, Y) => I + Y, 0),
      Z = [...A.toolResults.values()].reduce((I, Y) => I + Y, 0);
    Q.tool_request_percent = Math.round(G / A.total * 100), Q.tool_result_percent = Math.round(Z / A.total * 100), A.toolRequests.forEach((I, Y) => {
      Q[`tool_request_${Y}_percent`] = Math.round(I / A.total * 100)
    }), A.toolResults.forEach((I, Y) => {
      Q[`tool_result_${Y}_percent`] = Math.round(I / A.total * 100)
    })
  }
  return Q
}
// @from(Start 10013254, End 10013287)
vI2 = L(() => {
  xM();
  cQ()
})
// @from(Start 10013343, End 10015774)
function jD5(A, Q, B) {
  return {
    type: "callback",
    timeout: B,
    callback: async (G, Z, I, Y) => {
      let J = A.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, Q),
        W = {
          ...process.env,
          CLAUDE_PLUGIN_ROOT: Q,
          CLAUDE_PROJECT_DIR: uQ()
        };
      if (G.hook_event_name === "SessionStart" && Y !== void 0) W.CLAUDE_ENV_FILE = LsA(Y);
      let X = JSON.stringify(G),
        V = PD5(J, [], {
          env: W,
          shell: !0,
          signal: I
        }),
        F = "",
        K = "";
      V.stdout.on("data", (H) => {
        F += H.toString()
      }), V.stderr.on("data", (H) => {
        K += H.toString()
      }), V.stdin.on("error", (H) => {
        g(`Plugin hook stdin error for "${J}": ${H.message}`)
      }), V.stdin.write(X), V.stdin.end();
      let D;
      try {
        D = await new Promise((H, C) => {
          V.on("close", (E) => {
            H(E ?? 1)
          }), V.on("error", C)
        })
      } catch (H) {
        let C = H instanceof Error ? H.message : String(H);
        return AA(Error(`Plugin hook "${J}" failed to execute: ${C}`)), g(`Plugin hook spawn error: ${C}`), {
          suppressOutput: !1,
          systemMessage: `Plugin hook "${J}" failed to start: ${C}. Check that the command exists and is executable.`
        }
      }
      try {
        let H = F.trim();
        if (H.startsWith("{")) return JSON.parse(H)
      } catch (H) {
        g(`Plugin hook "${J}" produced invalid JSON output: ${H instanceof Error?H.message:String(H)}. Falling back to exit code handling.`)
      }
      if (D === 0) return {
        suppressOutput: !1
      };
      else if (D === 2) {
        let H = K.trim(),
          C = F.trim();
        return {
          decision: "block",
          reason: H ? H : C ? `Hook blocked with message: ${C}` : `Plugin hook "${J}" blocked this action (exit code 2) but provided no reason.`
        }
      } else {
        let H = K.trim(),
          C = F.trim(),
          E = [`Plugin hook "${J}" failed with exit code ${D}`];
        if (H) E.push(`stderr: ${H}`);
        if (C) E.push(`stdout: ${C}`);
        let U = E.join(`
`);
        return AA(Error(U)), g(U), {
          suppressOutput: !1,
          systemMessage: H ? `Plugin hook error: ${H}` : C ? `Plugin hook "${J}" exited with code ${D}: ${C}` : `Plugin hook "${J}" exited with code ${D}. See ${Ps()}`
        }
      }
    }
  }
}
// @from(Start 10015776, End 10016488)
function SD5(A) {
  let Q = {
    PreToolUse: [],
    PostToolUse: [],
    PostToolUseFailure: [],
    Notification: [],
    UserPromptSubmit: [],
    SessionStart: [],
    SessionEnd: [],
    Stop: [],
    SubagentStart: [],
    SubagentStop: [],
    PreCompact: [],
    PermissionRequest: []
  };
  if (!A.hooksConfig) return Q;
  for (let [B, G] of Object.entries(A.hooksConfig)) {
    let Z = B;
    if (!Q[Z]) continue;
    for (let I of G) {
      let Y = [];
      for (let J of I.hooks)
        if (J.type === "command") Y.push(jD5(J.command, A.path, J.timeout));
      if (Y.length > 0) Q[Z].push({
        matcher: I.matcher,
        hooks: Y,
        pluginName: A.name
      })
    }
  }
  return Q
}
// @from(Start 10016490, End 10016531)
function bI2() {
  _1A.cache?.clear?.()
}
// @from(Start 10016536, End 10016539)
_1A
// @from(Start 10016545, End 10017346)
dMA = L(() => {
  l2();
  fV();
  V0();
  _0();
  D$A();
  g1();
  _1A = s1(async () => {
    let {
      enabled: A
    } = await l7(), Q = {
      PreToolUse: [],
      PostToolUse: [],
      PostToolUseFailure: [],
      Notification: [],
      UserPromptSubmit: [],
      SessionStart: [],
      SessionEnd: [],
      Stop: [],
      SubagentStart: [],
      SubagentStop: [],
      PreCompact: [],
      PermissionRequest: []
    };
    for (let G of A) {
      if (!G.hooksConfig) continue;
      g(`Loading hooks from plugin: ${G.name}`);
      let Z = SD5(G);
      for (let I of Object.keys(Z)) Q[I].push(...Z[I])
    }
    LkA(Q);
    let B = Object.values(Q).reduce((G, Z) => G + Z.reduce((I, Y) => I + Y.hooks.length, 0), 0);
    g(`Registered ${B} hooks from ${A.length} plugins`)
  })
})
// @from(Start 10017348, End 10019075)
async function wq(A, Q) {
  let B = [],
    G = [];
  if (t21()) g("Skipping plugin hooks - allowManagedHooksOnly is enabled");
  else try {
    await _1A()
  } catch (Z) {
    let I = Z instanceof Error ? Error(`Failed to load plugin hooks during ${A}: ${Z.message}`) : Error(`Failed to load plugin hooks during ${A}: ${String(Z)}`);
    if (Z instanceof Error && Z.stack) I.stack = Z.stack;
    AA(I);
    let Y = Z instanceof Error ? Z.message : String(Z),
      J = "";
    if (Y.includes("Failed to clone") || Y.includes("network") || Y.includes("ETIMEDOUT") || Y.includes("ENOTFOUND")) J = "This appears to be a network issue. Check your internet connection and try again.";
    else if (Y.includes("Permission denied") || Y.includes("EACCES") || Y.includes("EPERM")) J = "This appears to be a permissions issue. Check file permissions on ~/.claude/plugins/";
    else if (Y.includes("Invalid") || Y.includes("parse") || Y.includes("JSON") || Y.includes("schema")) J = "This appears to be a configuration issue. Check your plugin settings in .claude/settings.json";
    else J = "Please fix the plugin configuration or remove problematic plugins from your settings.";
    g(`Warning: Failed to load plugin hooks. SessionStart hooks from plugins will not execute. Error: ${Y}. ${J}`, {
      level: "warn"
    })
  }
  for await (let Z of WQ0(A, Q)) {
    if (Z.message) B.push(Z.message);
    if (Z.additionalContexts && Z.additionalContexts.length > 0) G.push(...Z.additionalContexts)
  }
  if (G.length > 0) {
    let Z = l9({
      type: "hook_additional_context",
      content: G,
      hookName: "SessionStart",
      toolUseID: "SessionStart",
      hookEvent: "SessionStart"
    });
    B.push(Z)
  }
  return B
}
// @from(Start 10019080, End 10019147)
k1A = L(() => {
  YO();
  dMA();
  g1();
  V0();
  IO();
  CYA()
})
// @from(Start 10019149, End 10023527)
async function j91(A, Q, B, G, Z = !1) {
  try {
    if (A.length === 0) throw Error(cMA);
    let I = ZK(A),
      Y = yI2(A),
      J = {};
    try {
      J = xI2(Y)
    } catch (e) {
      AA(e)
    }
    let W = await Q.getAppState();
    P91(W.toolPermissionContext, "summary"), Q.setSpinnerColor?.("claudeBlue_FOR_SYSTEM_SPINNER"), Q.setSpinnerShimmerColor?.("claudeBlueShimmer_FOR_SYSTEM_SPINNER"), Q.setSpinnerMessage?.("Running PreCompact hooks..."), Q.setSDKStatus?.("compacting");
    let X = await FQ0({
      trigger: Z ? "auto" : "manual",
      customInstructions: G ?? null,
      sessionId: Q.agentId
    }, Q.abortController.signal);
    if (X.newCustomInstructions) G = G ? `${G}

${X.newCustomInstructions}` : X.newCustomInstructions;
    let V = X.userDisplayMessage;
    Q.setStreamMode?.("requesting"), Q.setResponseLength?.(() => 0), Q.setSpinnerMessage?.("Compacting conversation");
    let F = R91(G),
      K = R0({
        content: F
      }),
      H = RYA({
        messages: WZ([...nk(A), K]),
        systemPrompt: ["You are a helpful AI assistant tasked with summarizing conversations."],
        maxThinkingTokens: 0,
        tools: [n8],
        signal: Q.abortController.signal,
        options: {
          async getToolPermissionContext() {
            return (await Q.getAppState()).toolPermissionContext
          },
          model: k3(),
          toolChoice: void 0,
          isNonInteractiveSession: Q.options.isNonInteractiveSession,
          hasAppendSystemPrompt: Q.options.hasAppendSystemPrompt,
          maxOutputTokensOverride: EkA,
          querySource: "compact",
          agents: Q.options.agentDefinitions.activeAgents,
          mcpTools: [],
          agentIdOrSessionId: e1()
        }
      })[Symbol.asyncIterator](),
      C = await H.next(),
      E = !1,
      U;
    while (!C.done) {
      let e = C.value;
      if (!E && e.type === "stream_event" && e.event.type === "content_block_start" && e.event.content_block.type === "text") E = !0, Q.setStreamMode?.("responding");
      if (e.type === "stream_event" && e.event.type === "content_block_delta" && e.event.delta.type === "text_delta") {
        let l = e.event.delta.text.length;
        Q.setResponseLength?.((k) => k + l)
      }
      if (e.type === "assistant") U = e;
      C = await H.next()
    }
    if (!U) throw Error("Failed to get summary response from streaming");
    let q = ji(U);
    if (!q) throw GA("tengu_compact_failed", {
      reason: "no_summary",
      preCompactTokenCount: I
    }), Error("Failed to generate conversation summary - response did not contain valid text content");
    else if (q.startsWith(uV)) throw GA("tengu_compact_failed", {
      reason: "api_error",
      preCompactTokenCount: I
    }), Error(q);
    else if (q.startsWith(OYA)) throw GA("tengu_compact_failed", {
      reason: "prompt_too_long",
      preCompactTokenCount: I
    }), Error(xD5);
    let w = GA2(Q.readFileState);
    Q.readFileState.clear();
    let N = await bD5(w, Q, _D5),
      R = fD5(Q.agentId);
    if (R) N.push(R);
    let T = XQ0(Q.agentId);
    if (T) N.push(T);
    Q.setSpinnerMessage?.("Running SessionStart hooks...");
    let y = await wq("compact"),
      v = ZK([U]),
      x = C91(U);
    GA("tengu_compact", {
      preCompactTokenCount: I,
      postCompactTokenCount: v,
      compactionInputTokens: x?.input_tokens,
      compactionOutputTokens: x?.output_tokens,
      compactionCacheReadTokens: x?.cache_read_input_tokens ?? 0,
      compactionCacheCreationTokens: x?.cache_creation_input_tokens ?? 0,
      compactionTotalTokens: x ? x.input_tokens + (x.cache_creation_input_tokens ?? 0) + (x.cache_read_input_tokens ?? 0) + x.output_tokens : 0,
      ...J
    });
    let p = S91(Z ? "auto" : "manual", I ?? 0),
      u = [R0({
        content: T91(q, B),
        isCompactSummary: !0,
        isVisibleInTranscriptOnly: !0
      })];
    return {
      boundaryMarker: p,
      summaryMessages: u,
      attachments: N,
      hookResults: y,
      userDisplayMessage: V,
      preCompactTokenCount: I,
      postCompactTokenCount: v,
      compactionUsage: x
    }
  } catch (I) {
    throw vD5(I, Q), I
  } finally {
    Q.setStreamMode?.("requesting"), Q.setResponseLength?.(() => 0), Q.setSpinnerMessage?.(null), Q.setSDKStatus?.(null), Q.setSpinnerColor?.(null), Q.setSpinnerShimmerColor?.(null)
  }
}
// @from(Start 10023529, End 10023745)
function vD5(A, Q) {
  if (!GKA(A, pMA) && !GKA(A, cMA)) Q.addNotification?.({
    key: "error-compacting-conversation",
    text: "Error compacting conversation",
    priority: "immediate",
    color: "error"
  })
}
// @from(Start 10023746, End 10024431)
async function bD5(A, Q, B) {
  let G = Object.entries(A).map(([Y, J]) => ({
      filename: Y,
      ...J
    })).filter((Y) => !hD5(Y.filename, Q.agentId)).sort((Y, J) => J.timestamp - Y.timestamp).slice(0, B),
    Z = await Promise.all(G.map(async (Y) => {
      let J = await VQ0(Y.filename, {
        ...Q,
        fileReadingLimits: {
          maxTokens: yD5
        }
      }, "tengu_post_compact_file_restore_success", "tengu_post_compact_file_restore_error", "compact");
      return J ? l9(J) : null
    })),
    I = 0;
  return Z.filter((Y) => {
    if (Y === null) return !1;
    let J = gG(JSON.stringify(Y));
    if (I + J <= kD5) return I += J, !0;
    return !1
  })
}
// @from(Start 10024433, End 10024610)
function fD5(A) {
  let Q = Nh(A);
  if (Q.length === 0) return null;
  return l9({
    type: "todo",
    content: Q,
    itemCount: Q.length,
    context: "post-compact"
  })
}
// @from(Start 10024612, End 10024780)
function XQ0(A) {
  let Q = xU(A);
  if (!Q) return null;
  let B = yU(A);
  return l9({
    type: "plan_file_reference",
    planFilePath: B,
    planContent: Q
  })
}
// @from(Start 10024782, End 10025057)
function hD5(A, Q) {
  let B = Pl(A);
  try {
    let G = Pl(Ri(Q));
    if (B === G) return !0
  } catch {}
  try {
    let G = Pl(yU(Q));
    if (B === G) return !0
  } catch {}
  try {
    if (new Set(_I2.map((Z) => Pl(Gt(Z)))).has(B)) return !0
  } catch {}
  return !1
}
// @from(Start 10025062, End 10025069)
_D5 = 5
// @from(Start 10025073, End 10025084)
kD5 = 50000
// @from(Start 10025088, End 10025098)
yD5 = 5000
// @from(Start 10025102, End 10025141)
cMA = "Not enough messages to compact."
// @from(Start 10025145, End 10025230)
xD5 = "Conversation too long. Press esc twice to go up a few messages and try again."
// @from(Start 10025234, End 10025273)
pMA = "API Error: Request was aborted."
// @from(Start 10025279, End 10025476)
lMA = L(() => {
  fZ();
  ZO();
  cQ();
  q0();
  RZ();
  GO();
  Dq();
  vM();
  IQ0();
  t2();
  IO();
  Ti();
  jQ();
  NE();
  R9();
  JQ0();
  xM();
  vI2();
  g1();
  YO();
  k1A();
  _0()
})
// @from(Start 10025479, End 10025510)
function hI2() {
  return fI2
}
// @from(Start 10025512, End 10025541)
function gI2(A) {
  fI2 = A
}
// @from(Start 10025543, End 10025580)
function uI2() {
  _91 = Date.now()
}
// @from(Start 10025582, End 10025615)
function mI2() {
  _91 = void 0
}
// @from(Start 10025616, End 10025810)
async function dI2() {
  let A = Date.now();
  while (_91) {
    if (Date.now() - _91 > uD5) return;
    if (Date.now() - A > gD5) return;
    await new Promise((B) => setTimeout(B, 1000))
  }
}
// @from(Start 10025812, End 10025954)
function cI2() {
  let A = RA(),
    Q = k91();
  if (!A.existsSync(Q)) return null;
  return A.readFileSync(Q, {
    encoding: "utf-8"
  })
}
// @from(Start 10025959, End 10025970)
gD5 = 15000
// @from(Start 10025974, End 10025985)
uD5 = 60000
// @from(Start 10025989, End 10025992)
fI2
// @from(Start 10025994, End 10025997)
_91
// @from(Start 10026003, End 10026036)
KQ0 = L(() => {
  AQ();
  EJ()
})
// @from(Start 10026039, End 10026213)
function lD5(A, Q) {
  if (!Q.some((G) => G.type === "assistant") && !CQ0.has(A)) {
    if (BZ("cc_microcompact_ext", "mc_disabled", !1)) CQ0.add(A)
  }
  return CQ0.has(A)
}
// @from(Start 10026215, End 10026479)
function iI2(A) {
  if (!A.content) return 0;
  if (typeof A.content === "string") return gG(A.content);
  return A.content.reduce((Q, B) => {
    if (B.type === "text") return Q + gG(B.text);
    else if (B.type === "image") return Q + lI2;
    return Q
  }, 0)
}
// @from(Start 10026481, End 10026583)
function iD5(A, Q) {
  let B = pI2.get(A);
  if (B === void 0) B = iI2(Q), pI2.set(A, B);
  return B
}
// @from(Start 10026585, End 10027017)
function EQ0(A) {
  let Q = 0;
  for (let B of A) {
    if (B.type !== "user" && B.type !== "assistant") continue;
    if (!Array.isArray(B.message.content)) continue;
    for (let G of B.message.content)
      if (G.type === "text") Q += gG(G.text);
      else if (G.type === "tool_result") Q += iI2(G);
    else if (G.type === "image") Q += lI2;
    else Q += gG(JSON.stringify(G))
  }
  return Math.ceil(Q * 1.3333333333333333)
}
// @from(Start 10027019, End 10027109)
function nD5(A) {
  return y91.push(A), () => {
    y91 = y91.filter((Q) => Q !== A)
  }
}
// @from(Start 10027111, End 10027155)
function aD5() {
  y91.forEach((A) => A())
}
// @from(Start 10027156, End 10030129)
async function Si(A, Q, B) {
  if (x91 = !1, Y0(process.env.DISABLE_MICROCOMPACT)) return {
    messages: A
  };
  if (lD5(e1(), A)) return {
    messages: A
  };
  Y0(process.env.USE_API_CONTEXT_MANAGEMENT);
  let G = Q !== void 0,
    Z = G ? Q : dD5,
    I = [],
    Y = new Map;
  for (let D of A)
    if ((D.type === "user" || D.type === "assistant") && Array.isArray(D.message.content)) {
      for (let H of D.message.content)
        if (H.type === "tool_use" && pD5.has(H.name)) {
          if (!DQ0.has(H.id)) I.push(H.id)
        } else if (H.type === "tool_result" && I.includes(H.tool_use_id)) {
        let C = iD5(H.tool_use_id, H);
        Y.set(H.tool_use_id, C)
      }
    } let J = I.slice(-cD5),
    W = Array.from(Y.values()).reduce((D, H) => D + H, 0),
    X = 0,
    V = new Set;
  for (let D of I) {
    if (J.includes(D)) continue;
    if (W - X > Z) V.add(D), X += Y.get(D) || 0
  }
  if (!G) {
    let D = ZK(A);
    if (!x1A(D).isAboveWarningThreshold || X < mD5) V.clear(), X = 0
  }
  let F = (D) => {
    return DQ0.has(D) || V.has(D)
  };
  if (V.size > 0, V.size > 0) A.filter((H) => H && H.type === "attachment" && H.attachment.type === "memory" && !HQ0.has(H.uuid)).map((H) => ({
    uuid: H.uuid
  })).forEach((H) => HQ0.add(H.uuid));
  let K = [];
  for (let D of A) {
    if (D.type === "attachment" && HQ0.has(D.uuid)) continue;
    if (D.type !== "user" && D.type !== "assistant") {
      K.push(D);
      continue
    }
    if (!Array.isArray(D.message.content)) {
      K.push(D);
      continue
    }
    if (D.type === "user") {
      let H = [];
      for (let C of D.message.content)
        if (C.type === "tool_result" && F(C.tool_use_id)) H.push({
          ...C,
          content: "[Old tool result content cleared]"
        });
        else H.push(C);
      if (H.length > 0) K.push({
        ...D,
        message: {
          ...D.message,
          content: H
        }
      })
    } else {
      let H = [];
      for (let C of D.message.content) H.push(C);
      K.push({
        ...D,
        message: {
          ...D.message,
          content: H
        }
      })
    }
  }
  if (B && V.size > 0) {
    let D = new Map,
      H = new Set;
    for (let C of A)
      if ((C.type === "user" || C.type === "assistant") && Array.isArray(C.message.content)) {
        for (let E of C.message.content)
          if (E.type === "tool_use" && E.name === d5) {
            let U = E.input?.file_path;
            if (typeof U === "string")
              if (V.has(E.id)) D.set(U, E.id);
              else H.add(U)
          }
      } for (let [C] of D)
      if (!H.has(C)) B.readFileState.delete(C)
  }
  for (let D of V) DQ0.add(D);
  if (V.size > 0) return GA("tengu_microcompact", {
    toolsCompacted: V.size,
    totalUncompactedTokens: W,
    tokensAfterCompaction: W - X,
    tokensSaved: X,
    triggerType: G ? "manual" : "auto"
  }), x91 = !0, aD5(), {
    messages: K
  };
  return {
    messages: K
  }
}
// @from(Start 10030131, End 10030269)
function nI2() {
  let [A, Q] = v91.useState(x91);
  return v91.useEffect(() => {
    return nD5(() => {
      Q(x91)
    })
  }, []), A
}
// @from(Start 10030274, End 10030277)
v91
// @from(Start 10030279, End 10030290)
mD5 = 20000
// @from(Start 10030294, End 10030305)
dD5 = 40000
// @from(Start 10030309, End 10030316)
cD5 = 3
// @from(Start 10030320, End 10030330)
lI2 = 2000
// @from(Start 10030334, End 10030337)
pD5
// @from(Start 10030339, End 10030342)
DQ0
// @from(Start 10030344, End 10030347)
HQ0
// @from(Start 10030349, End 10030352)
pI2
// @from(Start 10030354, End 10030357)
CQ0
// @from(Start 10030359, End 10030367)
x91 = !1
// @from(Start 10030371, End 10030374)
y91
// @from(Start 10030380, End 10030637)
y1A = L(() => {
  xM();
  u2();
  q0();
  hQ();
  _0();
  cQ();
  GO();
  v1A();
  wF();
  yR();
  c9A();
  YS();
  v91 = BA(VA(), 1), pD5 = new Set([d5, C9, xY, iK, WS, $X, $5, wX]), DQ0 = new Set, HQ0 = new Set, pI2 = new Map, CQ0 = new Set;
  y91 = []
})
// @from(Start 10030639, End 10030675)
async function b91() {
  return !1
}
// @from(Start 10030677, End 10031081)
function sD5(A, Q, B, G) {
  let Z = ZK(A),
    I = S91("auto", Z ?? 0),
    Y = [R0({
      content: T91(Q, !0),
      isCompactSummary: !0,
      isVisibleInTranscriptOnly: !0
    })],
    J = XQ0(G);
  return {
    boundaryMarker: I,
    summaryMessages: Y,
    attachments: J ? [J] : [],
    hookResults: [],
    messagesToKeep: B,
    preCompactTokenCount: Z,
    postCompactTokenCount: EQ0(Y)
  }
}
// @from(Start 10031082, End 10031727)
async function f91(A, Q, B) {
  if (!await b91()) return null;
  await dI2();
  let G = hI2(),
    Z = cI2();
  if (!G || !Z) return null;
  try {
    let I = A.findIndex((V) => V.uuid === G);
    if (I === -1) return null;
    let Y = A.slice(I + 1),
      J = sD5(A, Z, Y, Q),
      W = [J.boundaryMarker, ...J.summaryMessages, ...J.attachments, ...J.hookResults, ...Y],
      X = EQ0(W);
    if (B !== void 0 && X >= B) return GA("tengu_sm_compact_threshold_exceeded", {
      postCompactTokenCount: X,
      autoCompactThreshold: B
    }), null;
    return {
      ...J,
      postCompactTokenCount: X
    }
  } catch {
    return null
  }
}
// @from(Start 10031732, End 10031808)
h91 = L(() => {
  lMA();
  GO();
  cQ();
  KQ0();
  u2();
  q0();
  y1A()
})
// @from(Start 10031811, End 10031880)
function TYA() {
  let A = k3(),
    Q = UQ0(A);
  return su(A) - Q
}
// @from(Start 10031882, End 10032157)
function aI2() {
  let A = TYA(),
    Q = A - zQ0,
    B = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE;
  if (B) {
    let G = parseFloat(B);
    if (!isNaN(G) && G > 0 && G <= 100) {
      let Z = Math.floor(A * (G / 100));
      return Math.min(Z, Q)
    }
  }
  return Q
}
// @from(Start 10032159, End 10032497)
function x1A(A) {
  let Q = aI2(),
    B = b1A() ? Q : TYA(),
    G = Math.max(0, Math.round((B - A) / B * 100)),
    Z = B - rD5,
    I = B - oD5,
    Y = A >= Z,
    J = A >= I,
    W = b1A() && A >= Q;
  return {
    percentLeft: G,
    isAboveWarningThreshold: Y,
    isAboveErrorThreshold: J,
    isAboveAutoCompactThreshold: W
  }
}
// @from(Start 10032499, End 10032550)
function b1A() {
  return N1().autoCompactEnabled
}
// @from(Start 10032551, End 10032732)
async function tD5(A, Q) {
  if (Q === "session_memory") return !1;
  if (!b1A()) return !1;
  let B = ZK(A),
    {
      isAboveAutoCompactThreshold: G
    } = x1A(B);
  return G
}
// @from(Start 10032733, End 10033246)
async function sI2(A, Q, B) {
  if (Y0(process.env.DISABLE_COMPACT)) return {
    wasCompacted: !1
  };
  if (!await tD5(A, B)) return {
    wasCompacted: !1
  };
  let Z = await f91(A, Q.agentId, aI2());
  if (Z) return {
    wasCompacted: !0,
    compactionResult: Z
  };
  try {
    return {
      wasCompacted: !0,
      compactionResult: await j91(A, Q, !0, void 0, !0)
    }
  } catch (I) {
    if (!GKA(I, pMA)) AA(I instanceof Error ? I : Error(String(I)));
    return {
      wasCompacted: !1
    }
  }
}
// @from(Start 10033251, End 10033262)
zQ0 = 13000
// @from(Start 10033266, End 10033277)
rD5 = 20000
// @from(Start 10033281, End 10033292)
oD5 = 20000
// @from(Start 10033298, End 10033389)
v1A = L(() => {
  GO();
  lMA();
  g1();
  jQ();
  RZ();
  t2();
  fZ();
  hQ();
  h91()
})
// @from(Start 10033539, End 10033608)
function tI2(A) {
  let Q = W0();
  return QH5(Q, BH5, `${A}.json`)
}
// @from(Start 10033610, End 10033860)
function $Q0(A) {
  let Q = tI2(A);
  if (!rI2(Q)) return [];
  try {
    let B = eD5(Q, "utf-8");
    return JSON.parse(B)
  } catch (B) {
    return g(`Failed to read mailbox for ${A}: ${B}`), AA(B instanceof Error ? B : Error(String(B))), []
  }
}
// @from(Start 10033862, End 10033920)
function eI2(A) {
  return $Q0(A).filter((B) => !B.read)
}
// @from(Start 10033922, End 10034463)
function AY2(A) {
  let Q = tI2(A);
  if (!rI2(Q)) return;
  let B = `${Q}.lock`,
    G;
  try {
    G = oI2.lockSync(Q, {
      lockfilePath: B
    });
    let Z = $Q0(A);
    if (Z.length === 0) return;
    let I = Z.map((Y) => ({
      ...Y,
      read: !0
    }));
    AH5(Q, JSON.stringify(I, null, 2), "utf-8"), g(`[TeammateMailbox] Marked ${Z.length} message(s) as read for ${A}`)
  } catch (Z) {
    g(`Failed to mark messages as read for ${A}: ${Z}`), AA(Z instanceof Error ? Z : Error(String(Z)))
  } finally {
    if (G) G()
  }
}
// @from(Start 10034465, End 10034593)
function QY2(A) {
  return A.map((Q) => `<teammate-message teammate_id="${Q.from}">
${Q.text}
</teammate-message>`).join(`

`)
}
// @from(Start 10034598, End 10034601)
oI2
// @from(Start 10034603, End 10034626)
BH5 = ".claude/mailbox"
// @from(Start 10034632, End 10034695)
g91 = L(() => {
  U2();
  g1();
  V0();
  oI2 = BA(T4A(), 1)
})
// @from(Start 10034823, End 10036370)
async function JH5(A, Q, B, G, Z, I) {
  if (Y0(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS)) return [];
  let Y = o9();
  setTimeout(() => {
    Y.abort()
  }, 1000);
  let J = {
      ...Q,
      abortController: Y
    },
    W = Q.agentId === e1(),
    X = A ? [aY("at_mentioned_files", () => zH5(A, J)), aY("mcp_resources", () => $H5(A, J)), aY("agent_mentions", () => Promise.resolve(UH5(A, Q.options.agentDefinitions.activeAgents)))] : [],
    V = await Promise.all(X),
    F = [aY("changed_files", () => wH5(J)), aY("nested_memory", () => qH5(J)), aY("ultra_claude_md", async () => DH5(Z)), aY("plan_mode", () => VH5(Z, Q)), aY("todo_reminders", () => _H5(Z, Q)), aY("teammate_mailbox", async () => vH5(Q)), aY("critical_system_reminder", () => Promise.resolve(FH5(Q)))],
    K = W ? [aY("ide_selection", async () => HH5(B, Q)), aY("ide_opened_file", async () => EH5(B, Q)), aY("output_style", async () => Promise.resolve(KH5())), aY("queued_commands", async () => WH5(G)), aY("diagnostics", async () => PH5()), aY("lsp_diagnostics", async () => jH5()), aY("background_shells", async () => yH5(Q)), aY("background_remote_sessions", async () => kH5(Q)), aY("async_hook_responses", async () => xH5()), aY("memory", async () => EI2(Q, Z, I)), aY("token_usage", async () => Promise.resolve(bH5(Z ?? []))), aY("budget_usd", async () => Promise.resolve(fH5(Q.options.maxBudgetUsd))), aY("async_agents", async () => hH5(Q))] : [],
    [D, H] = await Promise.all([Promise.all(F), Promise.all(K)]);
  return [...V.flat(), ...D.flat(), ...H.flat()]
}
// @from(Start 10036371, End 10036999)
async function aY(A, Q) {
  let B = Date.now();
  try {
    let G = await Q(),
      Z = Date.now() - B,
      I = G.reduce((Y, J) => {
        return Y + JSON.stringify(J).length
      }, 0);
    if (Math.random() < 0.05) GA("tengu_attachment_compute_duration", {
      label: A,
      duration_ms: Z,
      attachment_size_bytes: I,
      attachment_count: G.length
    });
    return G
  } catch (G) {
    let Z = Date.now() - B;
    if (Math.random() < 0.05) GA("tengu_attachment_compute_duration", {
      label: A,
      duration_ms: Z,
      error: !0
    });
    return AA(G), uN(`Attachment error in ${A}`, G), []
  }
}
// @from(Start 10037001, End 10037180)
function WH5(A) {
  if (!A) return [];
  return A.filter((Q) => Q.mode === "prompt").map((Q) => ({
    type: "queued_command",
    prompt: Q.value,
    source_uuid: Q.uuid
  }))
}
// @from(Start 10037182, End 10037588)
function XH5(A) {
  let Q = 0,
    B = !1;
  for (let G = A.length - 1; G >= 0; G--) {
    let Z = A[G];
    if (Z?.type === "assistant") {
      if (NQ0(Z)) continue;
      Q++
    } else if (Z?.type === "attachment" && (Z.attachment.type === "plan_mode" || Z.attachment.type === "plan_mode_reentry")) {
      B = !0;
      break
    }
  }
  return {
    turnCount: Q,
    foundPlanModeAttachment: B
  }
}
// @from(Start 10037589, End 10038153)
async function VH5(A, Q) {
  if ((await Q.getAppState()).toolPermissionContext.mode !== "plan") return [];
  if (A && A.length > 0) {
    let {
      turnCount: J,
      foundPlanModeAttachment: W
    } = XH5(A);
    if (W && J < IH5.TURNS_BETWEEN_ATTACHMENTS) return []
  }
  let Z = yU(Q.agentId),
    I = xU(Q.agentId),
    Y = [];
  if (Jz0() && I !== null) Y.push({
    type: "plan_mode_reentry",
    planFilePath: Z
  }), ou(!1);
  return Y.push({
    type: "plan_mode",
    isSubAgent: Q.isSubAgent,
    planFilePath: Z,
    planExists: I !== null
  }), Y
}
// @from(Start 10038155, End 10038314)
function FH5(A) {
  let Q = A.criticalSystemReminder_EXPERIMENTAL;
  if (!Q) return [];
  return [{
    type: "critical_system_reminder",
    content: Q
  }]
}
// @from(Start 10038316, End 10038466)
function KH5() {
  let Q = l0()?.outputStyle || "default";
  if (Q === "default") return [];
  return [{
    type: "output_style",
    style: Q
  }]
}
// @from(Start 10038468, End 10038499)
function DH5(A) {
  return []
}
// @from(Start 10038500, End 10038917)
async function HH5(A, Q) {
  let B = kQ1(Q.options.mcpClients);
  if (!B || A?.lineStart === void 0 || !A.text || !A.filePath) return [];
  let G = await Q.getAppState();
  if (PYA(A.filePath, G.toolPermissionContext)) return [];
  return [{
    type: "selected_lines_in_ide",
    ideName: B,
    lineStart: A.lineStart,
    lineEnd: A.lineStart + A.lineCount - 1,
    filename: A.filePath,
    content: A.text
  }]
}
// @from(Start 10038919, End 10039239)
function CH5(A, Q) {
  let B = wQ0(GH5(A)),
    G = [],
    Z = B;
  while (Z !== Q && Z !== BY2(Z).root) {
    if (Z.startsWith(Q)) G.push(Z);
    Z = wQ0(Z)
  }
  G.reverse();
  let I = [];
  Z = Q;
  while (Z !== BY2(Z).root) I.push(Z), Z = wQ0(Z);
  return I.reverse(), {
    nestedDirs: G,
    cwdLevelDirs: I
  }
}
// @from(Start 10039241, End 10039563)
function qQ0(A, Q) {
  let B = [];
  for (let G of A)
    if (!Q.readFileState.has(G.path)) B.push({
      type: "nested_memory",
      path: G.path,
      content: G
    }), Q.readFileState.set(G.path, {
      content: G.content,
      timestamp: Date.now(),
      offset: void 0,
      limit: void 0
    });
  return B
}
// @from(Start 10039565, End 10040028)
function ZY2(A, Q, B) {
  let G = [];
  try {
    if (!qT(A, B.toolPermissionContext)) return G;
    let Z = new Set,
      I = uQ(),
      Y = pZ2(A, Z);
    G.push(...qQ0(Y, Q));
    let {
      nestedDirs: J,
      cwdLevelDirs: W
    } = CH5(A, I);
    for (let X of J) {
      let V = lZ2(X, A, Z);
      G.push(...qQ0(V, Q))
    }
    for (let X of W) {
      let V = iZ2(X, A, Z);
      G.push(...qQ0(V, Q))
    }
  } catch (Z) {
    AA(Z)
  }
  return G
}
// @from(Start 10040029, End 10040290)
async function EH5(A, Q) {
  if (!A?.filePath || A.text) return [];
  let B = await Q.getAppState();
  if (PYA(A.filePath, B.toolPermissionContext)) return [];
  return [...ZY2(A.filePath, Q, B), {
    type: "opened_file_in_ide",
    filename: A.filePath
  }]
}
// @from(Start 10040291, End 10041369)
async function zH5(A, Q) {
  let B = NH5(A),
    G = await Q.getAppState();
  return (await Promise.all(B.map(async (I) => {
    try {
      let {
        filename: Y,
        lineStart: J,
        lineEnd: W
      } = OH5(I), X = b9(Y);
      if (PYA(X, G.toolPermissionContext)) return null;
      try {
        if (RA().statSync(X).isDirectory()) try {
          let F = await D9.call({
            command: `ls ${z8([X])}`,
            description: `Lists files in ${X}`
          }, Q);
          GA("tengu_at_mention_extracting_directory_success", {});
          let K = F.data.stdout;
          return {
            type: "directory",
            path: X,
            content: K
          }
        } catch {
          return null
        }
      } catch {}
      return await VQ0(X, Q, "tengu_at_mention_extracting_filename_success", "tengu_at_mention_extracting_filename_error", "at-mention", {
        offset: J,
        limit: W && J ? W - J + 1 : void 0
      })
    } catch {
      GA("tengu_at_mention_extracting_filename_error", {})
    }
  }))).filter(Boolean)
}
// @from(Start 10041371, End 10041768)
function UH5(A, Q) {
  let B = MH5(A);
  if (B.length === 0) return [];
  return B.map((Z) => {
    let I = Z.replace("agent-", ""),
      Y = Q.find((J) => J.agentType === I);
    if (!Y) return GA("tengu_at_mention_agent_not_found", {}), null;
    return GA("tengu_at_mention_agent_success", {}), {
      type: "agent_mention",
      agentType: Y.agentType
    }
  }).filter((Z) => Z !== null)
}
// @from(Start 10041769, End 10042913)
async function $H5(A, Q) {
  let B = LH5(A);
  if (B.length === 0) return [];
  let G = Q.options.mcpClients || [];
  return (await Promise.all(B.map(async (I) => {
    try {
      let [Y, ...J] = I.split(":"), W = J.join(":");
      if (!Y || !W) return GA("tengu_at_mention_mcp_resource_error", {}), null;
      let X = G.find((K) => K.name === Y);
      if (!X || X.type !== "connected") return GA("tengu_at_mention_mcp_resource_error", {}), null;
      let F = (Q.options.mcpResources?.[Y] || []).find((K) => K.uri === W);
      if (!F) return GA("tengu_at_mention_mcp_resource_error", {}), null;
      try {
        let K = await X.client.readResource({
          uri: W
        });
        return GA("tengu_at_mention_mcp_resource_success", {}), {
          type: "mcp_resource",
          server: Y,
          uri: W,
          name: F.name || W,
          description: F.description,
          content: K
        }
      } catch (K) {
        return GA("tengu_at_mention_mcp_resource_error", {}), AA(K), null
      }
    } catch {
      return GA("tengu_at_mention_mcp_resource_error", {}), null
    }
  }))).filter((I) => I !== null)
}
// @from(Start 10042914, End 10044320)
async function wH5(A) {
  let Q = await A.getAppState();
  return (await Promise.all(_l(A.readFileState).map(async (G) => {
    let Z = A.readFileState.get(G);
    if (!Z) return null;
    if (Z.offset !== void 0 || Z.limit !== void 0) return null;
    let I = b9(G);
    if (PYA(I, Q.toolPermissionContext)) return null;
    try {
      if (PD(I) <= Z.timestamp) return null;
      let Y = {
        file_path: I
      };
      if (!(await n8.validateInput(Y, A)).result) return null;
      let W = await n8.call(Y, A);
      if (I === Ri(A.agentId)) {
        let X = Nh(A.agentId);
        return {
          type: "todo",
          content: X,
          itemCount: X.length,
          context: "file-watch"
        }
      }
      if (W.data.type === "text") {
        if (l00(Z.content, W.data.file.content) === "") return null;
        return {
          type: "edited_text_file",
          filename: I,
          snippet: l00(Z.content, W.data.file.content)
        }
      }
      if (W.data.type === "image") try {
        let X = await Vo1(I);
        return {
          type: "edited_image_file",
          filename: I,
          content: X
        }
      } catch (X) {
        return AA(X), GA("tengu_watched_file_compression_failed", {
          file: I
        }), null
      }
    } catch {
      return GA("tengu_watched_file_stat_error", {}), null
    }
  }))).filter((G) => G !== null)
}
// @from(Start 10044321, End 10044645)
async function qH5(A) {
  let Q = await A.getAppState(),
    B = [];
  if (A.nestedMemoryAttachmentTriggers && A.nestedMemoryAttachmentTriggers.size > 0) {
    for (let G of A.nestedMemoryAttachmentTriggers) {
      let Z = ZY2(G, A, Q);
      B.push(...Z)
    }
    A.nestedMemoryAttachmentTriggers.clear()
  }
  return B
}
// @from(Start 10044647, End 10044978)
function NH5(A) {
  let Q = /(^|\s)@"([^"]+)"/g,
    B = /(^|\s)@([^\s]+)\b/g,
    G = [],
    Z = [],
    I;
  while ((I = Q.exec(A)) !== null)
    if (I[2]) G.push(I[2]);
  return (A.match(B) || []).forEach((J) => {
    let W = J.slice(J.indexOf("@") + 1);
    if (!W.startsWith('"')) Z.push(W)
  }), [...new Set([...G, ...Z])]
}
// @from(Start 10044980, End 10045129)
function LH5(A) {
  let Q = /(^|\s)@([^\s]+:[^\s]+)\b/g,
    B = A.match(Q) || [];
  return [...new Set(B.map((G) => G.slice(G.indexOf("@") + 1)))]
}
// @from(Start 10045131, End 10045280)
function MH5(A) {
  let Q = /(^|\s)@(agent-[\w:.@-]+)/g,
    B = A.match(Q) || [];
  return [...new Set(B.map((G) => G.slice(G.indexOf("@") + 1)))]
}
// @from(Start 10045282, End 10045552)
function OH5(A) {
  let Q = A.match(/^([^#]+)(?:#L(\d+)(?:-(\d+))?)?$/);
  if (!Q) return {
    filename: A
  };
  let [, B, G, Z] = Q, I = G ? parseInt(G, 10) : void 0, Y = Z ? parseInt(Z, 10) : I;
  return {
    filename: B ?? A,
    lineStart: I,
    lineEnd: Y
  }
}
// @from(Start 10045554, End 10045838)
function RH5(A) {
  let Q = 0,
    B = !1;
  for (let G = A.length - 1; G >= 0; G--) {
    let Z = A[G];
    if (Z?.type === "attachment" && Z.attachment.type === "ultramemory") {
      B = !0;
      break
    }
    if (Z?.type === "assistant") Q += TeB(Z)
  }
  return B ? Q : null
}
// @from(Start 10045840, End 10045978)
function TH5(A) {
  if (!A || A.length === 0) return !0;
  let Q = RH5(A);
  if (Q === null) return !0;
  return Q >= YH5.TOKEN_COOLDOWN
}
// @from(Start 10045979, End 10046146)
async function PH5() {
  let A = await Oh.getNewDiagnostics();
  if (A.length === 0) return [];
  return [{
    type: "diagnostics",
    files: A,
    isNew: !0
  }]
}
// @from(Start 10046147, End 10046832)
async function jH5() {
  g("LSP Diagnostics: getLSPDiagnosticAttachments called");
  try {
    let A = NI2();
    if (A.length === 0) return [];
    g(`LSP Diagnostics: Found ${A.length} pending diagnostic set(s)`);
    let Q = A.map(({
      files: B
    }) => ({
      type: "diagnostics",
      files: B,
      isNew: !0
    }));
    if (A.length > 0) LI2(), g(`LSP Diagnostics: Cleared ${A.length} delivered diagnostic(s) from registry`);
    return g(`LSP Diagnostics: Returning ${Q.length} diagnostic attachment(s)`), Q
  } catch (A) {
    let Q = A instanceof Error ? A : Error(String(A));
    return AA(Error(`Failed to get LSP diagnostic attachments: ${Q.message}`)), []
  }
}
// @from(Start 10046833, End 10047051)
async function* jYA(A, Q, B, G, Z, I) {
  let Y = await JH5(A, Q, B, G, Z, I);
  if (Y.length === 0) return;
  GA("tengu_attachments", {
    attachment_types: Y.map((J) => J.type)
  });
  for (let J of Y) yield l9(J)
}
// @from(Start 10047052, End 10048956)
async function VQ0(A, Q, B, G, Z, I) {
  let {
    offset: Y,
    limit: J
  } = I ?? {}, W = await Q.getAppState();
  if (PYA(A, W.toolPermissionContext)) return null;
  if (Z === "at-mention" && !Y01(A)) try {
    let V = RA().statSync(A);
    return GA("tengu_attachment_file_too_large", {
      size_bytes: V.size,
      mode: Z
    }), null
  } catch {}
  let X = Q.readFileState.get(A);
  if (X && Z === "at-mention") try {
    let V = PD(A);
    if (X.timestamp <= V && V === X.timestamp) return GA(B, {}), {
      type: "already_read_file",
      filename: A,
      content: {
        type: "text",
        file: {
          filePath: A,
          content: X.content,
          numLines: X.content.split(`
`).length,
          startLine: Y ?? 1,
          totalLines: X.content.split(`
`).length
        }
      }
    }
  } catch {}
  try {
    let V = {
      file_path: A,
      offset: Y,
      limit: J
    };
    async function F() {
      if (Z === "compact") return {
        type: "compact_file_reference",
        filename: A
      };
      let D = await Q.getAppState();
      if (PYA(A, D.toolPermissionContext)) return null;
      try {
        let H = {
            file_path: A,
            offset: Y ?? 1,
            limit: NKA
          },
          C = await n8.call(H, Q);
        return GA(B, {}), {
          type: "file",
          filename: A,
          content: C.data,
          truncated: !0
        }
      } catch {
        return GA(G, {}), null
      }
    }
    let K = await n8.validateInput(V, Q);
    if (!K.result) {
      if (K.meta?.fileSize) return await F();
      return null
    }
    try {
      let D = await n8.call(V, Q);
      return GA(B, {}), {
        type: "file",
        filename: A,
        content: D.data
      }
    } catch (D) {
      if (D instanceof Z01) return await F();
      throw D
    }
  } catch {
    return GA(G, {}), null
  }
}
// @from(Start 10048958, End 10049091)
function l9(A) {
  return {
    attachment: A,
    type: "attachment",
    uuid: ZH5(),
    timestamp: new Date().toISOString()
  }
}
// @from(Start 10049093, End 10049716)
function SH5(A) {
  let Q = -1,
    B = -1,
    G = 0,
    Z = 0;
  for (let I = A.length - 1; I >= 0; I--) {
    let Y = A[I];
    if (Y?.type === "assistant") {
      if (NQ0(Y)) continue;
      if (Q === -1) G++;
      if (B === -1) Z++;
      if (Q === -1 && "message" in Y && Array.isArray(Y.message?.content) && Y.message.content.some((J) => J.type === "tool_use" && J.name === "TodoWrite")) Q = I
    } else if (B === -1 && Y?.type === "attachment" && Y.attachment.type === "todo_reminder") B = I;
    if (Q !== -1 && B !== -1) break
  }
  return {
    turnsSinceLastTodoWrite: G,
    turnsSinceLastReminder: Z
  }
}
// @from(Start 10049717, End 10050077)
async function _H5(A, Q) {
  if (!A || A.length === 0) return [];
  let {
    turnsSinceLastTodoWrite: B,
    turnsSinceLastReminder: G
  } = SH5(A);
  if (B >= GY2.TURNS_SINCE_WRITE && G >= GY2.TURNS_BETWEEN_REMINDERS) {
    let Z = Nh(Q.agentId);
    return [{
      type: "todo_reminder",
      content: Z,
      itemCount: Z.length
    }]
  }
  return []
}
// @from(Start 10050078, End 10050786)
async function kH5(A) {
  if (!o2("tengu_web_tasks")) return [];
  let Q = await A.getAppState(),
    B = Object.values(Q.backgroundTasks).filter((Z) => Z.type === "remote_session" && Z.deltaSummarySinceLastFlushToAttachment !== null),
    G = B.map((Z) => ({
      type: "background_remote_session_status",
      taskId: Z.id,
      title: Z.title,
      status: Z.status,
      deltaSummarySinceLastFlushToAttachment: Z.deltaSummarySinceLastFlushToAttachment
    }));
  return A.setAppState((Z) => ({
    ...Z,
    backgroundTasks: {
      ...Z.backgroundTasks,
      ...Object.fromEntries(B.map((I) => [I.id, {
        ...I,
        deltaSummarySinceLastFlushToAttachment: null
      }]))
    }
  })), G
}
// @from(Start 10050787, End 10051580)
async function yH5(A) {
  let Q = await A.getAppState(),
    B = Object.values(Q.backgroundTasks).filter((I) => I.type === "shell"),
    G = QA2(B).filter((I) => I.hasNewOutput).map((I) => ({
      type: "background_shell_status",
      taskId: I.id,
      command: I.command,
      status: "running",
      hasNewOutput: I.hasNewOutput
    })),
    Z = BA2(B).map((I) => ({
      type: "background_shell_status",
      taskId: I.id,
      command: I.command,
      status: I.status,
      exitCode: I.result?.code,
      hasNewOutput: Ko1(I)
    }));
  return A.setAppState((I) => ({
    ...I,
    backgroundTasks: {
      ...I.backgroundTasks,
      ...Object.fromEntries(B.map((Y) => [Y.id, {
        ...Y,
        completionStatusSentInAttachment: !0
      }]))
    }
  })), [...G, ...Z]
}
// @from(Start 10051581, End 10052403)
async function xH5() {
  let A = await bZ2();
  if (A.length === 0) return [];
  g(`Hooks: getAsyncHookResponseAttachments found ${A.length} responses`);
  let Q = A.map(({
    processId: B,
    response: G,
    hookName: Z,
    hookEvent: I,
    toolName: Y,
    stdout: J,
    stderr: W,
    exitCode: X
  }) => {
    return g(`Hooks: Creating attachment for ${B} (${Z}): ${JSON.stringify(G)}`), {
      type: "async_hook_response",
      processId: B,
      hookName: Z,
      hookEvent: I,
      toolName: Y,
      response: G,
      stdout: J,
      stderr: W,
      exitCode: X
    }
  });
  if (A.length > 0) {
    let B = A.map((G) => G.processId);
    fZ2(B), g(`Hooks: Removed ${B.length} delivered hooks from registry`)
  }
  return g(`Hooks: getAsyncHookResponseAttachments found ${Q.length} attachments`), Q
}
// @from(Start 10052405, End 10052919)
function vH5(A) {
  let Q = e1(),
    B = process.env.CLAUDE_CODE_TEAMMATE_ID || Q;
  g(`[TeammateMailbox] Checking mailbox for teammate=${B} session=${Q}`);
  let G = eI2(B);
  if (g(`[TeammateMailbox] Found ${G.length} message(s) in mailbox`), G.length === 0) return [];
  return g(`[TeammateMailbox] Returning ${G.length} unread message(s) as attachment`), AY2(B), [{
    type: "teammate_mailbox",
    messages: G.map((Z) => ({
      from: Z.from,
      text: Z.text,
      timestamp: Z.timestamp
    }))
  }]
}
// @from(Start 10052921, End 10053139)
function bH5(A) {
  if (!Y0(process.env.CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT)) return [];
  let Q = TYA(),
    B = ZK(A);
  return [{
    type: "token_usage",
    used: B,
    total: Q,
    remaining: Q - B
  }]
}
// @from(Start 10053141, End 10053307)
function fH5(A) {
  if (A === void 0) return [];
  let Q = hK(),
    B = A - Q;
  return [{
    type: "budget_usd",
    used: Q,
    total: A,
    remaining: B
  }]
}
// @from(Start 10053308, End 10053997)
async function hH5(A) {
  let Q = await A.getAppState(),
    G = Object.values(Q.backgroundTasks).filter((Z) => Z.type === "async_agent").filter((Z) => Z.status !== "running" && !Z.notified).map((Z) => ({
      type: "async_agent_status",
      agentId: Z.agentId,
      description: Z.description,
      status: Z.status,
      error: Z.error
    }));
  if (G.length > 0) A.setAppState((Z) => {
    let I = {
      ...Z.backgroundTasks
    };
    for (let {
        agentId: Y
      }
      of G) {
      let J = I[Y];
      if (J?.type === "async_agent") I[Y] = {
        ...J,
        notified: !0
      }
    }
    return {
      ...Z,
      backgroundTasks: I
    }
  });
  return G
}
// @from(Start 10053999, End 10054066)
function u91(A) {
  return A.attachment.type === "queued_command"
}
// @from(Start 10054068, End 10054163)
function IY2(A) {
  return A.type === "async_hook_response" && A.hookEvent === "SessionStart"
}
// @from(Start 10054165, End 10054308)
function m91(A) {
  if (A.type !== "hook_success" && A.type !== "hook_non_blocking_error") return !1;
  return A.hookEvent === "SessionStart"
}
// @from(Start 10054310, End 10054375)
function PYA(A, Q) {
  return jD(A, Q, "read", "deny") !== null
}
// @from(Start 10054380, End 10054383)
GY2
// @from(Start 10054385, End 10054388)
IH5
// @from(Start 10054390, End 10054393)
YH5
// @from(Start 10054399, End 10054843)
IO = L(() => {
  q0();
  u2();
  Dq();
  yI();
  AQ();
  Ti();
  NE();
  nY();
  gE();
  g1();
  xM();
  V0();
  R1A();
  MB();
  P1A();
  dK();
  wF();
  vM();
  OZ();
  R9();
  EJ();
  _AA();
  zI2();
  _0();
  pF();
  y00();
  uMA();
  V0();
  cQ();
  hQ();
  GO();
  v1A();
  g91();
  GY2 = {
    TURNS_SINCE_WRITE: 7,
    TURNS_BETWEEN_REMINDERS: 3
  }, IH5 = {
    TURNS_BETWEEN_ATTACHMENTS: 5
  }, YH5 = {
    TOKEN_COOLDOWN: 5000
  }
})
// @from(Start 10054845, End 10054938)
async function YY2(A) {
  let Q;
  do Q = await A.next(); while (!Q.done);
  return Q.value
}
// @from(Start 10054939, End 10055587)
async function* SYA(A, Q = 1 / 0) {
  let B = (I) => {
      let Y = I.next().then(({
        done: J,
        value: W
      }) => ({
        done: J,
        value: W,
        generator: I,
        promise: Y
      }));
      return Y
    },
    G = [...A],
    Z = new Set;
  while (Z.size < Q && G.length > 0) {
    let I = G.shift();
    Z.add(B(I))
  }
  while (Z.size > 0) {
    let {
      done: I,
      value: Y,
      generator: J,
      promise: W
    } = await Promise.race(Z);
    if (Z.delete(W), !I) {
      if (Z.add(B(J)), Y !== void 0) yield Y
    } else if (G.length > 0) {
      let X = G.shift();
      Z.add(B(X))
    }
  }
}
// @from(Start 10055588, End 10055674)
async function d91(A) {
  let Q = [];
  for await (let B of A) Q.push(B);
  return Q
}
// @from(Start 10055675, End 10055728)
async function* LQ0(A) {
  for (let Q of A) yield Q
}
// @from(Start 10055733, End 10055736)
zgG
// @from(Start 10055742, End 10055786)
_i = L(() => {
  zgG = Symbol("NO_VALUE")
})
// @from(Start 10055789, End 10056164)
function f1A({
  param: {
    text: A
  },
  addMargin: Q
}) {
  let B = B9(A, "background-task-input");
  if (!B) return null;
  return Th.createElement(S, {
    flexDirection: "column",
    marginTop: Q ? 1 : 0,
    width: "100%"
  }, Th.createElement(S, null, Th.createElement($, {
    color: "background"
  }, "&"), Th.createElement($, {
    dimColor: !0
  }, " ", B)))
}
// @from(Start 10056169, End 10056171)
Th
// @from(Start 10056177, End 10056230)
MQ0 = L(() => {
  hA();
  cQ();
  Th = BA(VA(), 1)
})
// @from(Start 10056457, End 10056605)
function EG() {
  if (N6()) return dH5();
  return N1().fileCheckpointingEnabled !== !1 && !Y0(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING)
}
// @from(Start 10056607, End 10056751)
function dH5() {
  return Y0(process.env.CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING) && !Y0(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING)
}
// @from(Start 10056752, End 10057774)
async function kYA(A, Q, B) {
  if (!EG()) return;
  A((G) => {
    try {
      let Z = G.snapshots.at(-1);
      if (!Z) return AA(Error("FileHistory: Missing most recent snapshot")), GA("tengu_file_history_track_edit_failed", {}), G;
      let I = DY2(Q);
      if (Z.trackedFileBackups[I]) return G;
      let Y = G.trackedFiles.has(I) ? G.trackedFiles : new Set(G.trackedFiles).add(I),
        W = !RA().existsSync(Q),
        X = W ? OQ0(null, 1) : OQ0(Q, 1),
        V = Yv(Z);
      V.trackedFileBackups[I] = X;
      let F = {
        ...G,
        snapshots: [...G.snapshots.slice(0, -1), V],
        trackedFiles: Y
      };
      return CY2(F), l91(B, V, !0).catch((K) => {
        AA(Error(`FileHistory: Failed to record snapshot: ${K}`))
      }), GA("tengu_file_history_track_edit_success", {
        isNewFile: W,
        version: X.version
      }), g(`FileHistory: Tracked file modification for ${Q}`), F
    } catch (Z) {
      return AA(Z), GA("tengu_file_history_track_edit_failed", {}), G
    }
  })
}
// @from(Start 10057775, End 10059522)
async function yYA(A, Q) {
  if (!EG()) return;
  A((B) => {
    try {
      let G = RA(),
        Z = new Date,
        I = {},
        Y = B.snapshots.at(-1);
      if (Y) {
        g(`FileHistory: Making snapshot for message ${Q}`);
        for (let X of B.trackedFiles) try {
          let V = HY2(X);
          if (!G.existsSync(V)) {
            let F = Y.trackedFileBackups[X],
              K = F ? F.version + 1 : 1;
            I[X] = {
              backupFileName: null,
              version: K,
              backupTime: new Date
            }, GA("tengu_file_history_backup_deleted_file", {
              version: K
            }), g(`FileHistory: Missing tracked file: ${X}`)
          } else {
            let F = Y.trackedFileBackups[X];
            if (F && F.backupFileName !== null && !KY2(V, F.backupFileName)) {
              I[X] = F;
              continue
            }
            let K = F ? F.version + 1 : 1,
              D = OQ0(V, K);
            I[X] = D
          }
        } catch (V) {
          AA(V), GA("tengu_file_history_backup_file_failed", {})
        }
      }
      let J = {
          messageId: Q,
          trackedFileBackups: I,
          timestamp: Z
        },
        W = {
          ...B,
          snapshots: [...B.snapshots, J]
        };
      return CY2(W), l91(Q, J, !1).catch((X) => {
        AA(Error(`FileHistory: Failed to record snapshot: ${X}`))
      }), g(`FileHistory: Added snapshot for ${Q}, tracking ${B.trackedFiles.size} files`), GA("tengu_file_history_snapshot_success", {
        trackedFilesCount: B.trackedFiles.size,
        snapshotCount: W.snapshots.length
      }), W
    } catch (G) {
      return AA(G), GA("tengu_file_history_snapshot_failed", {}), B
    }
  })
}
// @from(Start 10059523, End 10060491)
async function iMA(A, Q) {
  if (!EG()) return;
  let B = null;
  if (A((G) => {
      let Z = G;
      try {
        let I = G.snapshots.findLast((J) => J.messageId === Q);
        if (!I) return AA(Error(`FileHistory: Snapshot for ${Q} not found`)), GA("tengu_file_history_rewind_failed", {
          trackedFilesCount: Z.trackedFiles.size,
          snapshotFound: !1
        }), B = Error("The selected snapshot was not found"), Z;
        g(`FileHistory: [Rewind] Rewinding to snapshot for ${Q}`);
        let Y = FY2(Z, I, !1);
        g(`FileHistory: [Rewind] Finished rewinding to ${Q}`), GA("tengu_file_history_rewind_success", {
          trackedFilesCount: Z.trackedFiles.size,
          filesChangedCount: Y?.filesChanged?.length
        })
      } catch (I) {
        B = I, AA(I), GA("tengu_file_history_rewind_failed", {
          trackedFilesCount: Z.trackedFiles.size,
          snapshotFound: !0
        })
      }
      return Z
    }), B) throw B
}
// @from(Start 10060493, End 10060591)
function c91(A, Q) {
  if (!EG()) return !1;
  return A.snapshots.some((B) => B.messageId === Q)
}
// @from(Start 10060593, End 10060731)
function TQ0(A, Q) {
  if (!EG()) return;
  let B = A.snapshots.find((G) => G.messageId === Q);
  if (!B) return;
  return FY2(A, B, !0)
}
// @from(Start 10060733, End 10061799)
function FY2(A, Q, B) {
  let G = RA(),
    Z = [],
    I = 0,
    Y = 0;
  for (let J of A.trackedFiles) try {
    let W = HY2(J),
      X = Q.trackedFileBackups[J],
      V = X ? X.backupFileName : lH5(J, A);
    if (V === void 0) AA(Error("FileHistory: Error finding the backup file to apply")), GA("tengu_file_history_rewind_restore_file_failed", {
      dryRun: B
    });
    else if (V === null) {
      if (G.existsSync(W)) {
        if (B) {
          let F = JY2(W, void 0);
          I += F?.insertions || 0, Y += F?.deletions || 0
        } else G.unlinkSync(W), g(`FileHistory: [Rewind] Deleted ${W}`);
        Z.push(W)
      }
    } else if (B) {
      let F = JY2(W, V);
      if (I += F?.insertions || 0, Y += F?.deletions || 0, F?.insertions || F?.deletions) Z.push(W)
    } else if (KY2(W, V)) pH5(W, V), g(`FileHistory: [Rewind] Restored ${W} from ${V}`), Z.push(W)
  } catch (W) {
    AA(W), GA("tengu_file_history_rewind_restore_file_failed", {
      dryRun: B
    })
  }
  return {
    filesChanged: Z,
    insertions: I,
    deletions: Y
  }
}
// @from(Start 10061801, End 10062311)
function KY2(A, Q) {
  let B = RA(),
    G = _YA(Q);
  try {
    let Z = B.existsSync(A),
      I = B.existsSync(G);
    if (Z !== I) return !0;
    else if (!Z) return !1;
    let Y = B.statSync(A),
      J = B.statSync(G);
    if (Y.mode !== J.mode || Y.size !== J.size) return !0;
    if (Y.mtimeMs < J.mtimeMs) return !1;
    let W = B.readFileSync(A, {
        encoding: "utf-8"
      }),
      X = B.readFileSync(G, {
        encoding: "utf-8"
      });
    return W !== X
  } catch {
    return !0
  }
}
// @from(Start 10062313, End 10063013)
function JY2(A, Q) {
  let B = [],
    G = 0,
    Z = 0;
  try {
    let I = RA(),
      Y = Q && _YA(Q),
      J = I.existsSync(A),
      W = Y && I.existsSync(Y);
    if (!J && !W) return {
      filesChanged: B,
      insertions: G,
      deletions: Z
    };
    B.push(A);
    let X = J ? I.readFileSync(A, {
        encoding: "utf-8"
      }) : "",
      V = W ? I.readFileSync(Y, {
        encoding: "utf-8"
      }) : "";
    X91(X, V).forEach((K) => {
      if (K.added) G += K.count || 0;
      if (K.removed) Z += K.count || 0
    })
  } catch (I) {
    AA(Error(`FileHistory: Error generating diffStats: ${I}`))
  }
  return {
    filesChanged: B,
    insertions: G,
    deletions: Z
  }
}
// @from(Start 10063015, End 10063107)
function cH5(A, Q) {
  return `${gH5("sha256").update(A).digest("hex").slice(0,16)}@v${Q}`
}
// @from(Start 10063109, End 10063193)
function _YA(A, Q) {
  let B = MQ();
  return WY2(B, "file-history", Q || e1(), A)
}
// @from(Start 10063195, End 10063749)
function OQ0(A, Q) {
  let B = A !== null ? cH5(A, Q) : null;
  if (A && B) {
    let G = RA(),
      Z = _YA(B),
      I = RQ0(Z);
    if (!G.existsSync(I)) G.mkdirSync(I);
    let Y = G.readFileSync(A, {
      encoding: "utf-8"
    });
    G.writeFileSync(Z, Y, {
      encoding: "utf-8",
      flush: !0
    });
    let J = G.statSync(A),
      W = J.mode;
    VY2(Z, W), GA("tengu_file_history_backup_file_created", {
      version: Q,
      fileSize: J.size
    })
  }
  return {
    backupFileName: B,
    version: Q,
    backupTime: new Date
  }
}
// @from(Start 10063751, End 10064200)
function pH5(A, Q) {
  let B = RA(),
    G = _YA(Q);
  if (!B.existsSync(G)) {
    GA("tengu_file_history_rewind_restore_file_failed", {}), AA(Error(`FileHistory: [Rewind] Backup file not found: ${G}`));
    return
  }
  let Z = B.readFileSync(G, {
      encoding: "utf-8"
    }),
    I = RQ0(A);
  if (!B.existsSync(I)) B.mkdirSync(I);
  B.writeFileSync(A, Z, {
    encoding: "utf-8",
    flush: !0
  });
  let Y = B.statSync(G).mode;
  VY2(A, Y)
}
// @from(Start 10064202, End 10064370)
function lH5(A, Q) {
  for (let B of Q.snapshots) {
    let G = B.trackedFileBackups[A];
    if (G !== void 0 && G.version === 1) return G.backupFileName
  }
  return
}
// @from(Start 10064372, End 10064484)
function DY2(A) {
  if (!XY2(A)) return A;
  let Q = uQ();
  if (A.startsWith(Q)) return uH5(Q, A);
  return A
}
// @from(Start 10064486, End 10064551)
function HY2(A) {
  if (XY2(A)) return A;
  return WY2(uQ(), A)
}
// @from(Start 10064553, End 10064893)
function xYA(A, Q) {
  if (!EG()) return;
  let B = [],
    G = new Set;
  for (let Z of A) {
    let I = {};
    for (let [Y, J] of Object.entries(Z.trackedFileBackups)) {
      let W = DY2(Y);
      G.add(W), I[W] = J
    }
    B.push({
      ...Z,
      trackedFileBackups: I
    })
  }
  Q({
    snapshots: B,
    trackedFiles: G
  })
}
// @from(Start 10064894, End 10066587)
async function p91(A) {
  if (!EG()) return;
  let Q = A.fileHistorySnapshots;
  if (!Q || A.messages.length === 0) return;
  let G = A.messages[A.messages.length - 1]?.sessionId;
  if (!G) {
    AA(Error("FileHistory: Failed to copy backups on restore (no previous session id)"));
    return
  }
  let Z = e1();
  if (G === Z) {
    g(`FileHistory: No need to copy file history for resuming with same session id: ${Z}`);
    return
  }
  try {
    for (let I of Q) {
      let Y = !1;
      for (let [J, W] of Object.entries(I.trackedFileBackups)) {
        if (!W.backupFileName) continue;
        let X = RA(),
          V = _YA(W.backupFileName, G),
          F = _YA(W.backupFileName, Z);
        if (X.existsSync(F)) continue;
        if (!X.existsSync(V)) {
          AA(Error(`FileHistory: Failed to copy backup ${W.backupFileName} on restore (backup file does not exist in ${G})`)), Y = !0;
          break
        }
        let K = RQ0(F);
        if (!X.existsSync(K)) X.mkdirSync(K);
        try {
          X.linkSync(V, F)
        } catch {
          AA(Error("FileHistory: Error hard linking backup file from previous session"));
          try {
            X.copyFileSync(V, F)
          } catch {
            Y = !0, AA(Error("FileHistory: Error copying over backup from previous session"))
          }
        }
        g(`FileHistory: Copied backup ${W.backupFileName} from session ${G} to ${Z}`)
      }
      if (!Y) l91(I.messageId, I, !1).catch((J) => {
        AA(Error("FileHistory: Failed to record copy backup snapshot"))
      });
      else GA("tengu_file_history_resume_copy_failed", {
        numSnapshots: Q.length
      })
    }
  } catch (I) {
    AA(I)
  }
}
// @from(Start 10066589, End 10066648)
function CY2(A) {
  if (iH5) console.error(mH5(A, !1, 5))
}
// @from(Start 10066653, End 10066661)
iH5 = !1
// @from(Start 10066667, End 10066765)
sU = L(() => {
  AQ();
  V0();
  _0();
  UxA();
  g1();
  S7();
  hQ();
  vMA();
  q0();
  jQ()
})
// @from(Start 10066814, End 10067135)
function nH5(A) {
  if (A.type !== "attachment") return A;
  let Q = A.attachment;
  if (Q.type === "new_file") return {
    ...A,
    attachment: {
      ...Q,
      type: "file"
    }
  };
  if (Q.type === "new_directory") return {
    ...A,
    attachment: {
      ...Q,
      type: "directory"
    }
  };
  return A
}
// @from(Start 10067137, End 10067340)
function nMA(A) {
  try {
    let Q = A.map(nH5),
      B = UY2(Q);
    if (B[B.length - 1]?.type === "user") B.push(uD({
      content: S1A
    }));
    return B
  } catch (Q) {
    throw AA(Q), Q
  }
}
// @from(Start 10067341, End 10067819)
async function zY2(A, Q) {
  try {
    let B = await YQ.get(A, {
      headers: Q,
      timeout: 30000
    });
    if (!B.data || !Array.isArray(B.data.log)) throw Error("Invalid response format: missing or invalid log array");
    return B.data
  } catch (B) {
    if (YQ.isAxiosError(B)) {
      let G = B.response ? `HTTP ${B.response.status}: ${B.response.statusText}` : B.message;
      throw Error(`Failed to fetch conversation from remote: ${G}`)
    }
    throw B
  }
}
// @from(Start 10067820, End 10068573)
async function ki(A, Q) {
  try {
    let B = null,
      G = null,
      Z;
    if (A === void 0) B = await wY2(0);
    else if (Q) {
      G = [];
      for (let Y of await Or(Q)) {
        if (Y.type === "assistant" || Y.type === "user") {
          let J = aH5(Y);
          if (J) G.push(J)
        }
        Z = Y.session_id
      }
    } else if (typeof A === "string") B = await $Y2(A), Z = A;
    else B = A;
    if (!B && !G) return null;
    if (B) {
      if (Z91(B), A01(B), p91(B), !Z) Z = VP(B);
      G = B.messages
    }
    G = nMA(G);
    let I = await wq("resume", Z);
    return G.push(...I), {
      messages: G,
      fileHistorySnapshots: B?.fileHistorySnapshots,
      sessionId: Z
    }
  } catch (B) {
    throw AA(B), B
  }
}
// @from(Start 10068575, End 10068912)
function aH5(A) {
  if (A.type === "assistant") return {
    type: A.type,
    message: A.message,
    uuid: EY2(),
    timestamp: new Date().toISOString(),
    requestId: void 0
  };
  else if (A.type === "user") return {
    type: A.type,
    message: A.message,
    uuid: EY2(),
    timestamp: new Date().toISOString()
  };
  return
}
// @from(Start 10068917, End 10069007)
vYA = L(() => {
  g1();
  S7();
  cQ();
  Ti();
  NE();
  LF();
  O3();
  k1A();
  sU()
})
// @from(Start 10069010, End 10071875)
function qY2({
  isDisabled: A = !1,
  visibleOptionCount: Q = 5,
  options: B,
  defaultValue: G = [],
  onChange: Z,
  onCancel: I,
  onFocus: Y,
  focusValue: J,
  submitButtonText: W,
  onSubmit: X
}) {
  let [V, F] = h1A.useState(G), [K, D] = h1A.useState(!1), [H, C] = h1A.useState(() => {
    let w = new Map;
    return B.forEach((N) => {
      if (N.type === "input" && N.initialValue) w.set(N.value, N.initialValue)
    }), w
  }), E = h1A.useCallback((w) => {
    let N = typeof w === "function" ? w(V) : w;
    F(N), Z?.(N)
  }, [V, Z]), U = RsA({
    visibleOptionCount: Q,
    options: B,
    initialFocusValue: void 0,
    onFocus: Y,
    focusValue: J
  }), q = h1A.useCallback((w, N) => {
    C((T) => {
      let y = new Map(T);
      return y.set(w, N), y
    });
    let R = B.find((T) => T.value === w);
    if (R && R.type === "input") R.onChange(N);
    E((T) => {
      if (N) {
        if (!T.includes(w)) return [...T, w];
        return T
      } else return T.filter((y) => y !== w)
    })
  }, [B, E]);
  return f1((w, N) => {
    let T = B.find((v) => v.value === U.focusedValue)?.type === "input";
    if (T) {
      if (!(N.upArrow || N.downArrow || N.escape || N.tab || N.return || N.ctrl && (w === "n" || w === "p" || N.return))) return
    }
    let y = B[B.length - 1]?.value;
    if (N.tab && !N.shift) {
      if (W && X && U.focusedValue === y && !K) D(!0);
      else if (!K) U.focusNextOption();
      return
    }
    if (N.tab && N.shift) {
      if (W && X && K) D(!1), U.focusOption(y);
      else U.focusPreviousOption();
      return
    }
    if (N.downArrow || N.ctrl && w === "n" || !N.ctrl && !N.shift && w === "j") {
      if (W && X && U.focusedValue === y && !K) D(!0);
      else if (!K) U.focusNextOption();
      return
    }
    if (N.upArrow || N.ctrl && w === "p" || !N.ctrl && !N.shift && w === "k") {
      if (W && X && K) D(!1), U.focusOption(y);
      else U.focusPreviousOption();
      return
    }
    if (N.pageDown) {
      U.focusNextPage();
      return
    }
    if (N.pageUp) {
      U.focusPreviousPage();
      return
    }
    if (N.return || w === " ") {
      if (N.ctrl && N.return && T && X) {
        X();
        return
      }
      if (K && X) {
        X();
        return
      }
      if (U.focusedValue !== void 0) {
        let v = V.includes(U.focusedValue) ? V.filter((x) => x !== U.focusedValue) : [...V, U.focusedValue];
        E(v)
      }
      return
    }
    if (/^[0-9]+$/.test(w)) {
      let v = parseInt(w) - 1;
      if (v >= 0 && v < B.length) {
        let x = B[v].value,
          p = V.includes(x) ? V.filter((u) => u !== x) : [...V, x];
        E(p)
      }
      return
    }
    if (N.escape) I()
  }, {
    isActive: !A
  }), {
    ...U,
    selectedValues: V,
    inputValues: H,
    isSubmitFocused: K,
    updateInputValue: q,
    onCancel: I
  }
}
// @from(Start 10071880, End 10071883)
h1A
// @from(Start 10071889, End 10071944)
NY2 = L(() => {
  hA();
  uu1();
  h1A = BA(VA(), 1)
})