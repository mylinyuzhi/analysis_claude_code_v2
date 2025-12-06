
// @from(Start 13810209, End 13814660)
MW9 = L(() => {
  Q2();
  AW9();
  KW9();
  lRA();
  yI();
  U2();
  AQ();
  EJ();
  g1();
  V0();
  NW9();
  Gk3 = j.strictObject({
    operation: j.enum(["goToDefinition", "findReferences", "hover", "documentSymbol", "workspaceSymbol"]).describe("The LSP operation to perform"),
    filePath: j.string().describe("The absolute or relative path to the file"),
    line: j.number().int().nonnegative().describe("The line number (0-indexed) in the file"),
    character: j.number().int().nonnegative().describe("The character offset (0-indexed) on the line")
  }), Zk3 = j.object({
    operation: j.enum(["goToDefinition", "findReferences", "hover", "documentSymbol", "workspaceSymbol"]).describe("The LSP operation that was performed"),
    result: j.string().describe("The formatted result of the LSP operation"),
    filePath: j.string().describe("The file path the operation was performed on"),
    resultCount: j.number().int().nonnegative().optional().describe("Number of results (definitions, references, symbols)"),
    fileCount: j.number().int().nonnegative().optional().describe("Number of files containing results")
  }), FV0 = {
    name: DW9,
    async description() {
      return WV0
    },
    userFacingName: EW9,
    isEnabled() {
      return !0
    },
    inputSchema: Gk3,
    outputSchema: Zk3,
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    getPath({
      filePath: A
    }) {
      return b9(A)
    },
    async validateInput(A) {
      let Q = eJ9.safeParse(A);
      if (!Q.success) return {
        result: !1,
        message: `Invalid input: ${Q.error.message}`,
        errorCode: 3
      };
      let B = RA(),
        G = b9(A.filePath);
      if (!B.existsSync(G)) return {
        result: !1,
        message: `File does not exist: ${A.filePath}`,
        errorCode: 1
      };
      try {
        if (!B.statSync(G).isFile()) return {
          result: !1,
          message: `Path is not a file: ${A.filePath}`,
          errorCode: 2
        }
      } catch (Z) {
        let I = Z instanceof Error ? Z : Error(String(Z));
        return AA(Error(`Failed to access file stats for LSP operation on ${A.filePath}: ${I.message}`)), {
          result: !1,
          message: `Cannot access file: ${A.filePath}. ${I.message}`,
          errorCode: 4
        }
      }
      return {
        result: !0
      }
    },
    async checkPermissions(A, Q) {
      let B = await Q.getAppState();
      return jl(FV0, A, B.toolPermissionContext)
    },
    async prompt() {
      return WV0
    },
    renderToolUseMessage: zW9,
    renderToolUseRejectedMessage: UW9,
    renderToolUseErrorMessage: $W9,
    renderToolUseProgressMessage: wW9,
    renderToolResultMessage: qW9,
    async call(A, Q) {
      let B = b9(A.filePath),
        G = W0(),
        Z = XWA();
      if (!Z) return AA(Error("LSP server manager not initialized when tool was called")), {
        data: {
          operation: A.operation,
          result: "LSP server manager not initialized. This may indicate a startup issue.",
          filePath: A.filePath
        }
      };
      let {
        method: I,
        params: Y
      } = Ik3(A, B);
      try {
        let J = await Z.sendRequest(B, I, Y);
        if (J === void 0) return g(`No LSP server available for file type ${VV0.extname(B)} for operation ${A.operation} on file ${A.filePath}`), {
          data: {
            operation: A.operation,
            result: `No LSP server available for file type: ${VV0.extname(B)}`,
            filePath: A.filePath
          }
        };
        let {
          formatted: W,
          resultCount: X,
          fileCount: V
        } = Wk3(A.operation, J, G);
        return {
          data: {
            operation: A.operation,
            result: W,
            filePath: A.filePath,
            resultCount: X,
            fileCount: V
          }
        }
      } catch (J) {
        let X = (J instanceof Error ? J : Error(String(J))).message;
        return AA(Error(`LSP tool request failed for ${A.operation} on ${A.filePath}: ${X}`)), {
          data: {
            operation: A.operation,
            result: `Error performing ${A.operation}: ${X}`,
            filePath: A.filePath
          }
        }
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: A.result
      }
    }
  }
})
// @from(Start 13814666, End 13814669)
Xk3
// @from(Start 13814675, End 13814737)
OW9 = L(() => {
  hA();
  iX();
  yJ();
  Xk3 = BA(VA(), 1)
})
// @from(Start 13814743, End 13814746)
q1I
// @from(Start 13814748, End 13814751)
N1I
// @from(Start 13814757, End 13815504)
RW9 = L(() => {
  Q2();
  OW9();
  zTA();
  cQ();
  sU();
  q0();
  q1I = j.strictObject({
    message_prefix: j.string().describe("The prefix of the user message to rewind to (searches backwards for first match)"),
    course_correction: j.string().describe("The new instructions to inject after rewinding, explaining what to do differently"),
    restore_code: j.boolean().default(!0).describe("Whether to restore code changes using file history (default: true)")
  }), N1I = j.object({
    target_message_preview: j.string().describe("Preview of the message that was rewound to"),
    course_correction: j.string().describe("The course correction that was injected"),
    code_restored: j.boolean().describe("Whether code was restored")
  })
})
// @from(Start 13815510, End 13815552)
TW9 = "Create a new task in the task list"
// @from(Start 13815556, End 13815796)
PW9 = `Use this tool to create a new task in the task list.

Tasks are used to track work items that need to be completed. Each task has:
- subject: A brief title for the task
- description: A detailed description of what needs to be done
`
// @from(Start 13815802, End 13815820)
jW9 = "TaskCreate"
// @from(Start 13815823, End 13815855)
function SW9() {
  return null
}
// @from(Start 13815857, End 13815889)
function _W9() {
  return null
}
// @from(Start 13815891, End 13815923)
function kW9() {
  return null
}
// @from(Start 13815925, End 13815957)
function yW9() {
  return null
}
// @from(Start 13815959, End 13815991)
function xW9() {
  return null
}
// @from(Start 13816176, End 13816205)
function Dx() {
  return !1
}
// @from(Start 13816207, End 13816257)
function UY1(A) {
  return bW9(MQ(), "tasks", A)
}
// @from(Start 13816259, End 13816315)
function KV0(A, Q) {
  return bW9(UY1(A), `${Q}.json`)
}
// @from(Start 13816316, End 13816412)
async function Ck3(A) {
  let Q = UY1(A);
  if (!zY1(Q)) await Vk3(Q, {
    recursive: !0
  })
}
// @from(Start 13816413, End 13816676)
async function Ek3(A) {
  let Q = UY1(A);
  if (!zY1(Q)) return 0;
  let B = await fW9(Q),
    G = 0;
  for (let Z of B) {
    if (!Z.endsWith(".json")) continue;
    let I = parseInt(Z.replace(".json", ""), 10);
    if (!isNaN(I) && I > G) G = I
  }
  return G
}
// @from(Start 13816677, End 13816817)
async function zk3(A) {
  await Ck3(A);
  let Q = vW9.get(A);
  if (Q === void 0) Q = await Ek3(A);
  return Q++, vW9.set(A, Q), String(Q)
}
// @from(Start 13816818, End 13816983)
async function gW9(A, Q) {
  let B = await zk3(A),
    G = {
      id: B,
      ...Q
    },
    Z = KV0(A, B);
  return await hW9(Z, JSON.stringify(G, null, 2)), B
}
// @from(Start 13816984, End 13817178)
async function pg(A, Q) {
  let B = KV0(A, Q);
  if (!zY1(B)) return null;
  let G = await Fk3(B, "utf-8"),
    Z = Hk3.safeParse(JSON.parse(G));
  if (!Z.success) return null;
  return Z.data
}
// @from(Start 13817179, End 13817386)
async function VVA(A, Q, B) {
  let G = await pg(A, Q);
  if (!G) return null;
  let Z = {
      ...G,
      ...B,
      id: Q
    },
    I = KV0(A, Q);
  return await hW9(I, JSON.stringify(Z, null, 2)), Z
}
// @from(Start 13817387, End 13817651)
async function uW9(A) {
  let Q = UY1(A);
  if (!zY1(Q)) return [];
  let B = await fW9(Q),
    G = [];
  for (let Z of B) {
    if (!Z.endsWith(".json")) continue;
    let I = Z.replace(".json", ""),
      Y = await pg(A, I);
    if (Y) G.push(Y)
  }
  return G
}
// @from(Start 13817652, End 13817791)
async function mW9(A, Q, B) {
  let G = await pg(A, Q);
  if (!G) return null;
  return VVA(A, Q, {
    comments: [...G.comments, B]
  })
}
// @from(Start 13817792, End 13818221)
async function $Y1(A, Q, B, G) {
  let Z = await pg(A, Q),
    I = await pg(A, B);
  if (!Z || !I) return !1;
  let Y = Z[G];
  if (!Y.includes(B)) await VVA(A, Q, {
    [G]: [...Y, B]
  });
  if (G === "references") {
    if (!I.references.includes(Q)) await VVA(A, B, {
      references: [...I.references, Q]
    })
  } else if (!I.blockedBy.includes(Q)) await VVA(A, B, {
    blockedBy: [...I.blockedBy, Q]
  });
  return !0
}
// @from(Start 13818226, End 13818229)
Kk3
// @from(Start 13818231, End 13818234)
Dk3
// @from(Start 13818236, End 13818239)
Hk3
// @from(Start 13818241, End 13818244)
vW9
// @from(Start 13818250, End 13818690)
FVA = L(() => {
  hQ();
  Q2();
  Kk3 = j.enum(["open", "resolved"]), Dk3 = j.object({
    author: j.string(),
    content: j.string()
  }), Hk3 = j.object({
    id: j.string(),
    subject: j.string(),
    description: j.string(),
    owner: j.string().optional(),
    status: Kk3,
    references: j.array(j.string()),
    blocks: j.array(j.string()),
    blockedBy: j.array(j.string()),
    comments: j.array(Dk3)
  });
  vW9 = new Map
})
// @from(Start 13818696, End 13818699)
Uk3
// @from(Start 13818701, End 13818704)
$k3
// @from(Start 13818706, End 13818709)
dW9
// @from(Start 13818715, End 13820373)
cW9 = L(() => {
  Q2();
  FVA();
  Uk3 = j.strictObject({
    subject: j.string().describe("A brief title for the task"),
    description: j.string().describe("A detailed description of what needs to be done")
  }), $k3 = j.object({
    task: j.object({
      id: j.string(),
      subject: j.string()
    })
  }), dW9 = {
    name: jW9,
    async description() {
      return TW9
    },
    async prompt() {
      return PW9
    },
    inputSchema: Uk3,
    outputSchema: $k3,
    userFacingName() {
      return "TaskCreate"
    },
    isEnabled() {
      return Dx()
    },
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !1
    },
    async checkPermissions(A) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    renderToolUseMessage: SW9,
    renderToolUseProgressMessage: _W9,
    renderToolUseRejectedMessage: kW9,
    renderToolUseErrorMessage: yW9,
    renderToolResultMessage: xW9,
    async call({
      subject: A,
      description: Q
    }) {
      return {
        data: {
          task: {
            id: await gW9("todo", {
              subject: A,
              description: Q,
              status: "open",
              owner: void 0,
              references: [],
              blocks: [],
              blockedBy: [],
              comments: []
            }),
            subject: A
          }
        }
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      let {
        task: B
      } = A;
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: `Task #${B.id} created successfully: ${B.subject}`
      }
    }
  }
})
// @from(Start 13820379, End 13820422)
pW9 = "Get a task by ID from the task list"
// @from(Start 13820426, End 13820670)
lW9 = `Use this tool to retrieve a task by its ID from the task list.

Returns the full task details including subject, description, status, comments, and relationships (references, blocks, blockedBy).

To see all tasks, use TaskList instead.
`
// @from(Start 13820676, End 13820691)
iW9 = "TaskGet"
// @from(Start 13820694, End 13820726)
function nW9() {
  return null
}
// @from(Start 13820728, End 13820760)
function aW9() {
  return null
}
// @from(Start 13820762, End 13820794)
function sW9() {
  return null
}
// @from(Start 13820796, End 13820828)
function rW9() {
  return null
}
// @from(Start 13820830, End 13820862)
function oW9() {
  return null
}
// @from(Start 13820867, End 13820870)
wk3
// @from(Start 13820872, End 13820875)
qk3
// @from(Start 13820877, End 13820880)
tW9
// @from(Start 13820886, End 13823451)
eW9 = L(() => {
  Q2();
  FVA();
  wk3 = j.strictObject({
    taskId: j.string().describe("The ID of the task to retrieve")
  }), qk3 = j.object({
    task: j.object({
      id: j.string(),
      subject: j.string(),
      description: j.string(),
      status: j.enum(["open", "resolved"]),
      references: j.array(j.string()),
      blocks: j.array(j.string()),
      blockedBy: j.array(j.string()),
      comments: j.array(j.object({
        author: j.string(),
        content: j.string()
      }))
    }).nullable()
  }), tW9 = {
    name: iW9,
    async description() {
      return pW9
    },
    async prompt() {
      return lW9
    },
    inputSchema: wk3,
    outputSchema: qk3,
    userFacingName() {
      return "TaskGet"
    },
    isEnabled() {
      return Dx()
    },
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    async checkPermissions(A) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    renderToolUseMessage: nW9,
    renderToolUseProgressMessage: aW9,
    renderToolUseRejectedMessage: sW9,
    renderToolUseErrorMessage: rW9,
    renderToolResultMessage: oW9,
    async call({
      taskId: A
    }) {
      let B = await pg("todo", A);
      if (!B) return {
        data: {
          task: null
        }
      };
      return {
        data: {
          task: {
            id: B.id,
            subject: B.subject,
            description: B.description,
            status: B.status,
            references: B.references,
            blocks: B.blocks,
            blockedBy: B.blockedBy,
            comments: B.comments
          }
        }
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      let {
        task: B
      } = A;
      if (!B) return {
        tool_use_id: Q,
        type: "tool_result",
        content: "Task not found",
        is_error: !0
      };
      let G = [`Task #${B.id}: ${B.subject}`, `Status: ${B.status}`, `Description: ${B.description}`];
      if (B.blockedBy.length > 0) G.push(`Blocked by: ${B.blockedBy.map((Z)=>`#${Z}`).join(", ")}`);
      if (B.blocks.length > 0) G.push(`Blocks: ${B.blocks.map((Z)=>`#${Z}`).join(", ")}`);
      if (B.references.length > 0) G.push(`References: ${B.references.map((Z)=>`#${Z}`).join(", ")}`);
      if (B.comments.length > 0) {
        G.push("Comments:");
        for (let Z of B.comments) G.push(`  [${Z.author}]: ${Z.content}`)
      }
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: G.join(`
`)
      }
    }
  }
})
// @from(Start 13823457, End 13823495)
AX9 = "Update a task in the task list"
// @from(Start 13823499, End 13824040)
QX9 = `Use this tool to update a task in the task list.

You can update any combination of:
- subject: Change the task title
- description: Change the task description
- status: Change to 'open' or 'resolved'
- owner: Assign or change the task owner
- addComment: Add a comment with author and content
- addReferences: Link to other tasks (bidirectional)
- addBlocks: Mark that this task blocks other tasks
- addBlockedBy: Mark that this task is blocked by other tasks

All fields are optional - only provide the fields you want to update.
`
// @from(Start 13824046, End 13824064)
BX9 = "TaskUpdate"
// @from(Start 13824067, End 13824099)
function GX9() {
  return null
}
// @from(Start 13824101, End 13824133)
function ZX9() {
  return null
}
// @from(Start 13824135, End 13824167)
function IX9() {
  return null
}
// @from(Start 13824169, End 13824201)
function YX9() {
  return null
}
// @from(Start 13824203, End 13824235)
function JX9() {
  return null
}
// @from(Start 13824240, End 13824243)
Nk3
// @from(Start 13824245, End 13824248)
Lk3
// @from(Start 13824250, End 13824253)
WX9
// @from(Start 13824259, End 13827611)
XX9 = L(() => {
  Q2();
  FVA();
  Nk3 = j.strictObject({
    taskId: j.string().describe("The ID of the task to update"),
    subject: j.string().optional().describe("New subject for the task"),
    description: j.string().optional().describe("New description for the task"),
    status: j.enum(["open", "resolved"]).optional().describe("New status for the task"),
    owner: j.string().optional().describe("New owner for the task"),
    addComment: j.object({
      author: j.string().describe("Author of the comment"),
      content: j.string().describe("Content of the comment")
    }).optional().describe("Add a comment to the task"),
    addReferences: j.array(j.string()).optional().describe("Task IDs to add as references"),
    addBlocks: j.array(j.string()).optional().describe("Task IDs that this task blocks"),
    addBlockedBy: j.array(j.string()).optional().describe("Task IDs that block this task")
  }), Lk3 = j.object({
    success: j.boolean(),
    taskId: j.string(),
    updatedFields: j.array(j.string())
  }), WX9 = {
    name: BX9,
    async description() {
      return AX9
    },
    async prompt() {
      return QX9
    },
    inputSchema: Nk3,
    outputSchema: Lk3,
    userFacingName() {
      return "TaskUpdate"
    },
    isEnabled() {
      return Dx()
    },
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !1
    },
    async checkPermissions(A) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    renderToolUseMessage: GX9,
    renderToolUseProgressMessage: ZX9,
    renderToolUseRejectedMessage: IX9,
    renderToolUseErrorMessage: YX9,
    renderToolResultMessage: JX9,
    async call({
      taskId: A,
      subject: Q,
      description: B,
      status: G,
      owner: Z,
      addComment: I,
      addReferences: Y,
      addBlocks: J,
      addBlockedBy: W
    }) {
      if (!await pg("todo", A)) return {
        data: {
          success: !1,
          taskId: A,
          updatedFields: []
        }
      };
      let F = [],
        K = {};
      if (Q !== void 0) K.subject = Q, F.push("subject");
      if (B !== void 0) K.description = B, F.push("description");
      if (G !== void 0) K.status = G, F.push("status");
      if (Z !== void 0) K.owner = Z, F.push("owner");
      if (Object.keys(K).length > 0) await VVA("todo", A, K);
      if (I) await mW9("todo", A, I), F.push("comments");
      if (Y && Y.length > 0) {
        for (let D of Y) await $Y1("todo", A, D, "references");
        F.push("references")
      }
      if (J && J.length > 0) {
        for (let D of J) await $Y1("todo", A, D, "blocks");
        F.push("blocks")
      }
      if (W && W.length > 0) {
        for (let D of W) await $Y1("todo", D, A, "blocks");
        F.push("blockedBy")
      }
      return {
        data: {
          success: !0,
          taskId: A,
          updatedFields: F
        }
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      let {
        success: B,
        taskId: G,
        updatedFields: Z
      } = A;
      if (!B) return {
        tool_use_id: Q,
        type: "tool_result",
        content: `Task #${G} not found`,
        is_error: !0
      };
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: `Updated task #${G} ${Z.join(", ")}`
      }
    }
  }
})
// @from(Start 13827617, End 13827656)
VX9 = "List all tasks in the task list"
// @from(Start 13827660, End 13827861)
FX9 = `Use this tool to list all tasks in the task list.

Returns a summary of each task including id, subject, status, owner, and open blockers.

Use TaskGet to view full details of a specific task.
`
// @from(Start 13827867, End 13827883)
KX9 = "TaskList"
// @from(Start 13827886, End 13827918)
function DX9() {
  return null
}
// @from(Start 13827920, End 13827952)
function HX9() {
  return null
}
// @from(Start 13827954, End 13827986)
function CX9() {
  return null
}
// @from(Start 13827988, End 13828020)
function EX9() {
  return null
}
// @from(Start 13828022, End 13828054)
function zX9() {
  return null
}
// @from(Start 13828059, End 13828062)
Mk3
// @from(Start 13828064, End 13828067)
Ok3
// @from(Start 13828069, End 13828072)
UX9
// @from(Start 13828078, End 13830007)
$X9 = L(() => {
  Q2();
  FVA();
  Mk3 = j.strictObject({}), Ok3 = j.object({
    tasks: j.array(j.object({
      id: j.string(),
      subject: j.string(),
      status: j.enum(["open", "resolved"]),
      owner: j.string().optional(),
      blockedBy: j.array(j.string())
    }))
  }), UX9 = {
    name: KX9,
    async description() {
      return VX9
    },
    async prompt() {
      return FX9
    },
    inputSchema: Mk3,
    outputSchema: Ok3,
    userFacingName() {
      return "TaskList"
    },
    isEnabled() {
      return Dx()
    },
    isConcurrencySafe() {
      return !0
    },
    isReadOnly() {
      return !0
    },
    async checkPermissions(A) {
      return {
        behavior: "allow",
        updatedInput: A
      }
    },
    renderToolUseMessage: DX9,
    renderToolUseProgressMessage: HX9,
    renderToolUseRejectedMessage: CX9,
    renderToolUseErrorMessage: EX9,
    renderToolResultMessage: zX9,
    async call() {
      let Q = await uW9("todo"),
        B = new Set(Q.filter((Z) => Z.status === "resolved").map((Z) => Z.id));
      return {
        data: {
          tasks: Q.map((Z) => ({
            id: Z.id,
            subject: Z.subject,
            status: Z.status,
            owner: Z.owner,
            blockedBy: Z.blockedBy.filter((I) => !B.has(I))
          }))
        }
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      let {
        tasks: B
      } = A;
      if (B.length === 0) return {
        tool_use_id: Q,
        type: "tool_result",
        content: "No tasks found"
      };
      let G = B.map((Z) => {
        let I = Z.owner ? ` (${Z.owner})` : "",
          Y = Z.blockedBy.length > 0 ? ` [blocked by ${Z.blockedBy.map((J)=>`#${J}`).join(", ")}]` : "";
        return `#${Z.id} [${Z.status}] ${Z.subject}${I}${Y}`
      });
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: G.join(`
`)
      }
    }
  }
})
// @from(Start 13830013, End 13830016)
Rk3
// @from(Start 13830018, End 13830021)
H0I
// @from(Start 13830023, End 13830026)
C0I
// @from(Start 13830032, End 13830361)
wX9 = L(() => {
  hA();
  Q2();
  Rk3 = BA(VA(), 1), H0I = j.strictObject({
    sizeKB: j.number().min(1).max(1e4).describe("Size of output to generate in kilobytes")
  }), C0I = j.object({
    generatedSizeBytes: j.number().describe("Actual size of generated content"),
    message: j.string().describe("Status message")
  })
})
// @from(Start 13830364, End 13830458)
function qX9(A) {
  let Q = A.toLowerCase();
  if (!Tk3.includes(Q)) return null;
  return Q
}
// @from(Start 13830460, End 13830585)
function DV0() {
  let A = wY1(),
    Q = A.map((B) => B.isEnabled());
  return A.filter((B, G) => Q[G]).map((B) => B.name)
}
// @from(Start 13830587, End 13830824)
function wY1() {
  return [jn, D9, zO, Py, gq, n8, lD, QV, kP, nV, BY, ZSA, CY1, HY1, Y71, ln, nn, cTA, ...[], ...[], ...[], ...Dx() ? [dW9, tW9, WX9, UX9] : [], ...[], ...process.env.ENABLE_LSP_TOOL ? [FV0] : [], ...[], ...[], Wh, Xh]
}
// @from(Start 13830829, End 13830832)
Tk3
// @from(Start 13830834, End 13830837)
CTA
// @from(Start 13830839, End 13830842)
Qf2
// @from(Start 13830844, End 13830847)
Bf2
// @from(Start 13830849, End 13831172)
LC = (A) => {
  let Q = new Set([Wh.name, Xh.name, Az]),
    B = wY1().filter((Y) => !Q.has(Y.name)),
    G = KVA(A),
    Z = B.filter((Y) => {
      return !G.some((J) => J.ruleValue.toolName === Y.name && J.ruleValue.ruleContent === void 0)
    }),
    I = Z.map((Y) => Y.isEnabled());
  return Z.filter((Y, J) => I[J])
}
// @from(Start 13831178, End 13831687)
yq = L(() => {
  DTA();
  G71();
  I71();
  pF();
  zn();
  Dq();
  rh();
  KTA();
  DWA();
  oWA();
  ZV0();
  YV0();
  GV0();
  JV0();
  kt();
  dTA();
  sJ9();
  VTA();
  tJ9();
  J71();
  MW9();
  RW9();
  fQ1();
  hQ1();
  GZ0();
  cW9();
  eW9();
  XX9();
  $X9();
  FVA();
  eXA();
  wX9();
  AZ();
  Tk3 = ["default"];
  CTA = new Set([gq.name, A71, A6, pJ, DY1, ...[]]), Qf2 = new Set([...CTA]), Bf2 = new Set([n8.name, ZSA.name, BY.name, Py.name, nV.name, zO.name, C9, lD.name, QV.name, kP.name])
})
// @from(Start 13831735, End 13832263)
async function r51(A, Q) {
  let B = o2("tengu_tool_pear"),
    G = {
      name: A.name,
      description: await A.prompt({
        getToolPermissionContext: Q.getToolPermissionContext,
        tools: Q.tools,
        agents: Q.agents
      }),
      input_schema: "inputJSONSchema" in A && A.inputJSONSchema ? A.inputJSONSchema : sRA(A.inputSchema)
    };
  if (B && A.strict === !0 && Q.model && BU1(Q.model)) G.strict = !0;
  if (Q.betas?.includes(abA) && A.input_examples) G.input_examples = A.input_examples;
  return G
}
// @from(Start 13832265, End 13832456)
function NX9(A) {
  let [Q] = HV0(A);
  GA("tengu_sysprompt_block", {
    snippet: Q?.slice(0, 20),
    length: Q?.length ?? 0,
    hash: Q ? Pk3("sha256").update(Q).digest("hex") : ""
  })
}
// @from(Start 13832458, End 13832561)
function HV0(A) {
  let Q = A[0] || "",
    B = A.slice(1);
  return [Q, B.join(`
`)].filter(Boolean)
}
// @from(Start 13832563, End 13832676)
function LX9(A, Q) {
  return [...A, Object.entries(Q).map(([B, G]) => `${B}: ${G}`).join(`
`)].filter(Boolean)
}
// @from(Start 13832678, End 13833129)
function gQA(A, Q) {
  if (Object.entries(Q).length === 0) return A;
  return [R0({
    content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries(Q).map(([B,G])=>`# ${B}
${G}`).join(`
`)}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`,
    isMeta: !0
  }), ...A]
}
// @from(Start 13833130, End 13834200)
async function MX9(A, Q) {
  if (PCB()) return;
  let [{
    tools: B
  }, G, Z, I] = await Promise.all([$21(A), LC(Q), DK(), iD()]), Y = I.gitStatus?.length ?? 0, J = Z.claudeMd?.length ?? 0, W = Y + J, X = o9();
  setTimeout(() => X.abort(), 1000);
  let V = W0(),
    F = TWA(Q),
    K = RWA(F, V),
    D = await myA(V, X.signal, K),
    H = 0,
    C = 0,
    E = 0,
    U = 0,
    q = 0,
    w = G.filter((R) => !R.isMcp);
  H = B.length, U = w.length;
  let N = new Set;
  for (let R of B) {
    let T = R.name.split("__");
    if (T.length >= 3 && T[1]) N.add(T[1])
  }
  C = N.size;
  try {
    if (B.length > 0) {
      let {
        mcpToolTokens: R
      } = await XTA(B, async () => Q, null);
      E = R
    }
    if (w.length > 0) q = await yb2(G, async () => Q, null)
  } catch {}
  GA("tengu_context_size", {
    git_status_size: Y,
    claude_md_size: J,
    total_context_size: W,
    project_file_count_rounded: D,
    mcp_tools_count: H,
    mcp_servers_count: C,
    mcp_tools_tokens: E,
    non_mcp_tools_count: U,
    non_mcp_tools_tokens: q
  })
}
// @from(Start 13834202, End 13835804)
function OX9(A, Q, B) {
  switch (A.name) {
    case rRA: {
      let G = xU(B);
      if (G) return {
        ...Q,
        plan: G
      };
      return Q
    }
    case D9.name: {
      let G = D9.inputSchema.parse(Q),
        {
          command: Z,
          timeout: I,
          description: Y,
          run_in_background: J
        } = G,
        W = Z.replace(`cd ${W0()} && `, "");
      if (W = W.replace(/\\\\;/g, "\\;"), /^echo\s+["']?[^|&;><]*["']?$/i.test(W.trim())) GA("tengu_bash_tool_simple_echo", {});
      return {
        command: W,
        description: Y,
        ...I ? {
          timeout: I
        } : {},
        ...Y ? {
          description: Y
        } : {},
        ...J ? {
          run_in_background: J
        } : {},
        ..."dangerouslyDisableSandbox" in G && G.dangerouslyDisableSandbox ? {
          dangerouslyDisableSandbox: G.dangerouslyDisableSandbox
        } : {}
      }
    }
    case lD.name: {
      let G = lD.inputSchema.parse(Q),
        {
          file_path: Z,
          edits: I
        } = DI2({
          file_path: G.file_path,
          edits: [{
            old_string: G.old_string,
            new_string: G.new_string,
            replace_all: G.replace_all
          }]
        });
      return {
        replace_all: I[0].replace_all,
        file_path: Z,
        old_string: I[0].old_string,
        new_string: I[0].new_string
      }
    }
    case QV.name: {
      let G = QV.inputSchema.parse(Q);
      return {
        file_path: G.file_path,
        content: p00(G.content)
      }
    }
    default:
      return Q
  }
}
// @from(Start 13835806, End 13836060)
function RX9(A, Q) {
  switch (A.name) {
    case rRA: {
      if (Q && typeof Q === "object" && "plan" in Q) {
        let {
          plan: B,
          ...G
        } = Q;
        return G
      }
      return Q
    }
    default:
      return Q
  }
}
// @from(Start 13836065, End 13836068)
jk3
// @from(Start 13836074, End 13836276)
th = L(() => {
  D30();
  u2();
  q0();
  cQ();
  sj();
  U2();
  EJ();
  pF();
  zn();
  P1A();
  rh();
  OZ();
  NE();
  V0();
  s51();
  CS();
  sbA();
  Ok();
  Ty();
  yq();
  jk3 = BA(Tb2(), 1)
})
// @from(Start 13836282, End 13836347)
TX9 = L(() => {
  q0();
  cQ();
  fZ();
  th();
  OZ();
  t2()
})
// @from(Start 13836353, End 13836428)
PX9 = L(() => {
  u2();
  pF();
  rh();
  zn();
  DWA();
  g1();
  TX9()
})
// @from(Start 13836535, End 13836582)
function _k3() {
  return qY1(cH(W0()), e1())
}
// @from(Start 13836584, End 13836627)
function NY1() {
  return qY1(_k3(), CV0)
}
// @from(Start 13836628, End 13836723)
async function kk3() {
  try {
    await _X9(NY1(), {
      recursive: !0
    })
  } catch {}
}
// @from(Start 13836724, End 13837983)
async function SX9(A, Q) {
  await kk3();
  let B = Date.now(),
    G = `${Q}-${B}`,
    Z = qY1(NY1(), G),
    I = f7(A, !1) !== null,
    J = qY1(Z, `result.${I?"json":"txt"}`);
  try {
    await _X9(Z, {
      recursive: !0
    }), await Sk3(J, A, "utf-8")
  } catch (F) {
    return AA(F instanceof Error ? F : Error(String(F))), HNB(A, V01)
  }
  let {
    preview: W,
    hasMore: X
  } = xk3(A, jX9), V = `<persisted-output>
`;
  if (V += `Output too large (${UJ(A.length)}). Full output saved to: ${J}

`, V += `Preview (first ${UJ(jX9)}):
`, V += W, X) V += `
...

`;
  else V += `

`;
  if (V += `You can explore this file using:
`, V += `- ${d5} tool to view portions of the file
`, V += `- ${xY} tool to search for patterns
`, I) V += `- ${C9} with jq to query JSON data (e.g., jq ".results[] | select(.status == \\"error\\")" ${J})
`;
  return V += `- ${C9} with head/tail for beginning/end (e.g., head -100 ${J})
`, V += "</persisted-output>", g(`Persisted large tool result to ${J} (${UJ(A.length)})`), GA("tengu_tool_result_persisted", {
    toolName: Q,
    originalSizeBytes: A.length,
    persistedSizeBytes: V.length,
    estimatedOriginalTokens: Math.ceil(A.length / Do1),
    estimatedPersistedTokens: Math.ceil(V.length / Do1)
  }), V
}
// @from(Start 13837984, End 13838094)
async function kX9(A, Q, B) {
  let G = A.mapToolResultToToolResultBlockParam(Q, B);
  return yk3(G, A.name)
}
// @from(Start 13838095, End 13838707)
async function yk3(A, Q) {
  if (!await hX("tengu_tool_result_persistence")) return A;
  if (typeof A.content === "string" && A.content.length > V01) return {
    ...A,
    content: await SX9(A.content, Q)
  };
  if (Array.isArray(A.content)) {
    let G = !1,
      Z = await Promise.all(A.content.map(async (I) => {
        if ("type" in I && I.type === "text" && "text" in I && typeof I.text === "string" && I.text.length > V01) return G = !0, {
          ...I,
          text: await SX9(I.text, Q)
        };
        return I
      }));
    if (G) return {
      ...A,
      content: Z
    }
  }
  return A
}
// @from(Start 13838709, End 13838928)
function xk3(A, Q) {
  if (A.length <= Q) return {
    preview: A,
    hasMore: !1
  };
  let G = A.slice(0, Q).lastIndexOf(`
`),
    Z = G > Q * 0.5 ? G : Q;
  return {
    preview: A.slice(0, Z),
    hasMore: !0
  }
}
// @from(Start 13838933, End 13838953)
CV0 = "tool-results"
// @from(Start 13838957, End 13838967)
jX9 = 2000
// @from(Start 13838973, End 13839078)
LY1 = L(() => {
  V0();
  g1();
  R9();
  q0();
  LF();
  _0();
  S7();
  U2();
  wF();
  yR();
  u2()
})
// @from(Start 13839081, End 13839114)
function xX9(A) {
  yX9.push(A)
}
// @from(Start 13839115, End 13839430)
async function vX9(A, Q, B, G, Z, I) {
  let Y = {
    messages: A,
    systemPrompt: Q,
    userContext: B,
    systemContext: G,
    toolUseContext: Z,
    querySource: I
  };
  for (let J of yX9) try {
    await J(Y)
  } catch (W) {
    AA(W instanceof Error ? W : Error(`Post-sampling hook failed: ${W}`))
  }
}
// @from(Start 13839435, End 13839438)
yX9
// @from(Start 13839444, End 13839481)
ISA = L(() => {
  g1();
  yX9 = []
})
// @from(Start 13839487, End 13839490)
MY1
// @from(Start 13839496, End 13839538)
bX9 = L(() => {
  _0();
  MY1 = new Map
})
// @from(Start 13839540, End 13843487)
class EV0 {
  toolDefinitions;
  canUseTool;
  tools = [];
  toolUseContext;
  hasErrored = !1;
  constructor(A, Q, B) {
    this.toolDefinitions = A;
    this.canUseTool = Q;
    this.toolUseContext = B
  }
  addTool(A, Q) {
    let B = this.toolDefinitions.find((I) => I.name === A.name);
    if (!B) return;
    let G = B.inputSchema.safeParse(A.input),
      Z = G?.success ? B.isConcurrencySafe(G.data) : !1;
    this.tools.push({
      id: A.id,
      block: A,
      assistantMessage: Q,
      status: "queued",
      isConcurrencySafe: Z
    }), this.processQueue()
  }
  canExecuteTool(A) {
    let Q = this.tools.filter((B) => B.status === "executing");
    return Q.length === 0 || A && Q.every((B) => B.isConcurrencySafe)
  }
  async processQueue() {
    for (let A of this.tools) {
      if (A.status !== "queued") continue;
      if (this.canExecuteTool(A.isConcurrencySafe)) await this.executeTool(A);
      else if (!A.isConcurrencySafe) break
    }
  }
  createSyntheticErrorMessage(A, Q) {
    let B = Q === "user_interrupted" ? "Interrupted by user" : "Sibling tool call errored";
    return R0({
      content: [{
        type: "tool_result",
        content: `<tool_use_error>${B}</tool_use_error>`,
        is_error: !0,
        tool_use_id: A
      }],
      toolUseResult: B
    })
  }
  getAbortReason() {
    if (this.hasErrored) return "sibling_error";
    if (this.toolUseContext.abortController.signal.aborted) return "user_interrupted";
    return null
  }
  async executeTool(A) {
    A.status = "executing", this.toolUseContext.setInProgressToolUseIDs((I) => new Set([...I, A.id]));
    let Q = [],
      B = [],
      Z = (async () => {
        let I = this.getAbortReason();
        if (I) {
          Q.push(this.createSyntheticErrorMessage(A.id, I)), A.results = Q, A.contextModifiers = B, A.status = "completed";
          return
        }
        let Y = OY1(A.block, A.assistantMessage, this.canUseTool, this.toolUseContext);
        for await (let J of Y) {
          let W = this.getAbortReason();
          if (W) {
            Q.push(this.createSyntheticErrorMessage(A.id, W));
            break
          }
          if (J.message.type === "user" && Array.isArray(J.message.message.content) && J.message.message.content.some((X) => X.type === "tool_result" && X.is_error === !0)) this.hasErrored = !0, this.toolUseContext.abortController.abort();
          if (J.message) Q.push(J.message);
          if (J.contextModifier) B.push(J.contextModifier.modifyContext)
        }
        if (A.results = Q, A.contextModifiers = B, A.status = "completed", !A.isConcurrencySafe && B.length > 0)
          for (let J of B) this.toolUseContext = J(this.toolUseContext)
      })();
    A.promise = Z, Z.finally(() => {
      this.processQueue()
    })
  }* getCompletedResults() {
    for (let A of this.tools) {
      if (A.status === "yielded") continue;
      if (A.status === "completed" && A.results) {
        A.status = "yielded";
        for (let Q of A.results) yield {
          message: Q
        };
        vk3(this.toolUseContext, A.id)
      } else if (A.status === "executing" && !A.isConcurrencySafe) break
    }
  }
  async * getRemainingResults() {
    while (this.hasUnfinishedTools()) {
      await this.processQueue();
      for (let A of this.getCompletedResults()) yield A;
      if (this.hasExecutingTools() && !this.hasCompletedResults()) {
        let A = this.tools.filter((Q) => Q.status === "executing" && Q.promise).map((Q) => Q.promise);
        if (A.length > 0) await Promise.race(A)
      }
    }
    for (let A of this.getCompletedResults()) yield A
  }
  hasCompletedResults() {
    return this.tools.some((A) => A.status === "completed")
  }
  hasExecutingTools() {
    return this.tools.some((A) => A.status === "executing")
  }
  hasUnfinishedTools() {
    return this.tools.some((A) => A.status !== "yielded")
  }
  getUpdatedContext() {
    return this.toolUseContext
  }
}
// @from(Start 13843489, End 13843586)
function vk3(A, Q) {
  A.setInProgressToolUseIDs((B) => new Set([...B].filter((G) => G !== Q)))
}
// @from(Start 13843591, End 13843624)
fX9 = L(() => {
  Ca();
  cQ()
})
// @from(Start 13843673, End 13845416)
function RY1(A) {
  return async (Q) => {
    try {
      if (!await A.shouldRun(Q)) return;
      let G = bk3(),
        Z = A.buildMessages(Q);
      Q.queryMessageCount = Z.length;
      let I = A.systemPrompt ? [A.systemPrompt] : Q.systemPrompt,
        J = A.useTools ?? !0 ? Q.toolUseContext.options.tools : [],
        W = A.getModel(),
        X = await wy({
          messages: Z,
          systemPrompt: I,
          maxThinkingTokens: 0,
          tools: J,
          signal: o9().signal,
          options: {
            getToolPermissionContext: async () => {
              return (await Q.toolUseContext.getAppState()).toolPermissionContext
            },
            model: W,
            toolChoice: void 0,
            isNonInteractiveSession: Q.toolUseContext.options.isNonInteractiveSession,
            hasAppendSystemPrompt: Q.toolUseContext.options.hasAppendSystemPrompt,
            temperatureOverride: 0,
            agents: Q.toolUseContext.options.agentDefinitions.activeAgents,
            querySource: A.name,
            mcpTools: [],
            agentIdOrSessionId: Q.toolUseContext.agentId
          }
        }),
        V = X.message.content.filter((F) => F.type === "text").map((F) => F.text).join("").trim();
      try {
        let F = A.parseResponse(V, Q);
        A.logResult({
          type: "success",
          queryName: A.name,
          result: F,
          messageId: X.message.id,
          model: W,
          uuid: G
        }, Q)
      } catch (F) {
        A.logResult({
          type: "error",
          queryName: A.name,
          error: F,
          uuid: G
        }, Q)
      }
    } catch (B) {
      AA(B instanceof Error ? B : Error(`API query hook ${A.name} failed`))
    }
  }
}
// @from(Start 13845421, End 13845462)
zV0 = L(() => {
  fZ();
  OZ();
  g1()
})
// @from(Start 13845464, End 13845497)
async function hX9() {
  return
}
// @from(Start 13845498, End 13845547)
async function gX9(A) {
  if (UV0) await UV0(A)
}
// @from(Start 13845552, End 13845562)
UV0 = null
// @from(Start 13845568, End 13845634)
$V0 = L(() => {
  zV0();
  cQ();
  q0();
  u2();
  t2();
  th()
})
// @from(Start 13845636, End 13845791)
async function uX9() {
  if (N6()) return;
  if (!1 === "false") {
    TY1 = !1;
    return
  }
  if (!1 === "1") {
    TY1 = !0;
    return
  }
  return
}
// @from(Start 13845792, End 13848310)
async function mX9(A) {
  if (!TY1) return;
  if (A.querySource !== "repl_main_thread") return;
  try {
    let B = {
        ...A.toolUseContext,
        options: {
          ...A.toolUseContext.options,
          maxThinkingTokens: 0
        }
      },
      G = await YY1({
        promptMessages: [R0({
          content: `You are now a prompt suggestion generator. The conversation above is context - your job is to suggest what Claude could help with next.

Based on the conversation, suggest the user's next prompt. Short casual input, 3-8 words (like "run the tests" or "now fix the linting errors").

Even if the immediate task seems done, think about natural follow-ups: run tests, commit changes, verify it works, clean up, etc. Almost always suggest something useful. Only say "done" if you truly cannot think of any reasonable next step.

Reply with ONLY the suggestion text, no quotes, no explanation, no markdown.`
        })],
        cacheSafeParams: {
          ...IY1(A),
          toolUseContext: B
        },
        canUseTool: async () => ({
          behavior: "deny",
          message: "No tools needed for suggestion",
          decisionReason: {
            type: "other",
            reason: "suggestion only"
          }
        }),
        querySource: "prompt_suggestion",
        forkLabel: "prompt_suggestion"
      }),
      I = G.messages.find((X) => X.type === "assistant")?.message?.content?.find((X) => X.type === "text");
    if (!I || I.type !== "text") return;
    let Y = I.text.trim(),
      J = Y.toLowerCase();
    if (g(`Prompt suggestion returned: "${Y}"`), !Y || J === "done" || Y.length >= 100 || Y.includes(`
`) || Y.includes("**") || Y.includes("*")) return;
    if (J.includes("prompt is too long") || J.includes("context length") || J.includes("token limit")) return;
    if (J.includes("thanks") || J.includes("thank you") || J.includes("looks good") || J.includes("that worked") || J.includes("that's all")) return;
    A.toolUseContext.setAppState((X) => ({
      ...X,
      promptSuggestion: {
        text: Y,
        shownAt: Date.now()
      }
    }));
    let W = G.totalUsage.input_tokens + G.totalUsage.cache_creation_input_tokens + G.totalUsage.cache_read_input_tokens;
    GA("tengu_prompt_suggestion_shown", {
      source: "forked_agent",
      ...W > 0 && {
        cacheHitRate: G.totalUsage.cache_read_input_tokens / W
      },
      ...!1
    })
  } catch (Q) {
    AA(Q instanceof Error ? Q : Error("Prompt suggestion generation failed"))
  }
}
// @from(Start 13848315, End 13848346)
fk3 = "tengu_prompt_suggestion"
// @from(Start 13848350, End 13848358)
TY1 = !1
// @from(Start 13848364, End 13848438)
wV0 = L(() => {
  JY1();
  cQ();
  u2();
  _0();
  q0();
  g1();
  V0()
})
// @from(Start 13848444, End 13848447)
YSA
// @from(Start 13848453, End 13849998)
qV0 = L(() => {
  YSA = class YSA {
    returned;
    queue = [];
    readResolve;
    readReject;
    isDone = !1;
    hasError;
    started = !1;
    constructor(A) {
      this.returned = A
    } [Symbol.asyncIterator]() {
      if (this.started) throw Error("Stream can only be iterated once");
      return this.started = !0, this
    }
    next() {
      if (this.queue.length > 0) return Promise.resolve({
        done: !1,
        value: this.queue.shift()
      });
      if (this.isDone) return Promise.resolve({
        done: !0,
        value: void 0
      });
      if (this.hasError) return Promise.reject(this.hasError);
      return new Promise((A, Q) => {
        this.readResolve = A, this.readReject = Q
      })
    }
    enqueue(A) {
      if (this.readResolve) {
        let Q = this.readResolve;
        this.readResolve = void 0, this.readReject = void 0, Q({
          done: !1,
          value: A
        })
      } else this.queue.push(A)
    }
    done() {
      if (this.isDone = !0, this.readResolve) {
        let A = this.readResolve;
        this.readResolve = void 0, this.readReject = void 0, A({
          done: !0,
          value: void 0
        })
      }
    }
    error(A) {
      if (this.hasError = A, this.readReject) {
        let Q = this.readReject;
        this.readResolve = void 0, this.readReject = void 0, Q(A)
      }
    }
    return () {
      if (this.isDone = !0, this.returned) this.returned();
      return Promise.resolve({
        done: !0,
        value: void 0
      })
    }
  }
})
// @from(Start 13850047, End 13850149)
function hk3() {
  return parseInt(process.env.CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY || "", 10) || 10
}
// @from(Start 13850151, End 13850454)
function* PY1(A, Q) {
  for (let B of A) {
    let G = B.message.content.filter((Z) => Z.type === "tool_use");
    for (let Z of G) yield R0({
      content: [{
        type: "tool_result",
        content: Q,
        is_error: !0,
        tool_use_id: Z.id
      }],
      toolUseResult: Q
    })
  }
}
// @from(Start 13850455, End 13858750)
async function* O$({
  messages: A,
  systemPrompt: Q,
  userContext: B,
  systemContext: G,
  canUseTool: Z,
  toolUseContext: I,
  autoCompactTracking: Y,
  fallbackModel: J,
  stopHookActive: W,
  querySource: X
}) {
  let V = I.options.sdkBetas;
  yield {
    type: "stream_request_start"
  };
  let F = I.queryTracking ? {
      chainId: I.queryTracking.chainId,
      depth: I.queryTracking.depth + 1
    } : {
      chainId: dX9(),
      depth: 0
    },
    K = F.chainId;
  I = {
    ...I,
    queryTracking: F
  };
  let D = e1();
  if (!MY1.has(D)) MY1.set(D, new Set);
  let H = MY1.get(D),
    C = nk(A),
    E = Y,
    U = await Si(C, void 0, I);
  if (C = U.messages, U.compactionInfo?.systemMessage) yield U.compactionInfo.systemMessage;
  let {
    compactionResult: q
  } = await sI2(C, I, X);
  if (q) {
    let {
      preCompactTokenCount: OA,
      postCompactTokenCount: mA,
      compactionUsage: wA
    } = q;
    if (GA("tengu_auto_compact_succeeded", {
        originalMessageCount: A.length,
        compactedMessageCount: q.summaryMessages.length + q.attachments.length + q.hookResults.length,
        preCompactTokenCount: OA,
        postCompactTokenCount: mA,
        compactionInputTokens: wA?.input_tokens,
        compactionOutputTokens: wA?.output_tokens,
        compactionCacheReadTokens: wA?.cache_read_input_tokens ?? 0,
        compactionCacheCreationTokens: wA?.cache_creation_input_tokens ?? 0,
        compactionTotalTokens: wA ? wA.input_tokens + (wA.cache_creation_input_tokens ?? 0) + (wA.cache_read_input_tokens ?? 0) + wA.output_tokens : 0,
        queryChainId: K,
        queryDepth: F.depth
      }), !E?.compacted) E = {
      compacted: !0,
      turnId: dX9(),
      turnCounter: 0
    };
    let qA = [q.boundaryMarker, ...q.summaryMessages, ...q.attachments, ...q.hookResults, ...q.messagesToKeep ?? []];
    for (let KA of qA) yield KA;
    C = qA
  }
  I = {
    ...I,
    messages: C
  };
  let w = [],
    N = [],
    T = await hX("tengu_streaming_tool_execution2") ? new EV0(I.options.tools, Z, I) : null,
    y = await I.getAppState(),
    v = y.toolPermissionContext.mode,
    x = Pt({
      permissionMode: v,
      mainLoopModel: I.options.mainLoopModel,
      exceeds200kTokens: v === "plan" && z91(C)
    }),
    p = LX9(Q, G),
    u = !0;
  try {
    while (u) {
      u = !1;
      try {
        let OA = !1,
          mA = C.filter((wA) => !H.has(wA.uuid));
        for await (let wA of RYA({
          messages: gQA(mA, B),
          systemPrompt: p,
          maxThinkingTokens: I.options.maxThinkingTokens,
          tools: I.options.tools,
          signal: I.abortController.signal,
          options: {
            async getToolPermissionContext() {
              return (await I.getAppState()).toolPermissionContext
            },
            model: x,
            toolChoice: void 0,
            isNonInteractiveSession: I.options.isNonInteractiveSession,
            fallbackModel: J,
            sdkBetas: V,
            onStreamingFallback: () => {
              OA = !0
            },
            querySource: X,
            agents: I.options.agentDefinitions.activeAgents,
            hasAppendSystemPrompt: I.options.hasAppendSystemPrompt,
            fetchOverride: void 0,
            mcpTools: y.mcp.tools,
            queryTracking: F,
            taskIntensityOverride: g60(),
            agentIdOrSessionId: I.agentId
          }
        })) {
          if (OA) {
            for (let qA of w) H.add(qA.uuid);
            GA("tengu_orphaned_messages_tracked", {
              orphanedMessageCount: w.length,
              queryChainId: K,
              queryDepth: F.depth
            }), yield* PY1(w, "Streaming fallback triggered"), w.length = 0
          }
          if (yield wA, wA.type === "assistant") {
            if (w.push(wA), T) {
              let qA = wA.message.content.filter((KA) => KA.type === "tool_use");
              for (let KA of qA) T.addTool(KA, wA)
            }
          }
          if (T) {
            for (let qA of T.getCompletedResults())
              if (qA.message) yield qA.message, N.push(...WZ([qA.message]).filter((KA) => KA.type === "user"))
          }
        }
      } catch (OA) {
        if (OA instanceof o61 && J) {
          x = J, u = !0, yield* PY1(w, "Model fallback triggered"), w.length = 0, I.options.mainLoopModel = J, GA("tengu_model_fallback_triggered", {
            original_model: OA.originalModel,
            fallback_model: J,
            entrypoint: "cli",
            queryChainId: K,
            queryDepth: F.depth
          }), yield $y(`Model fallback triggered: switching from ${OA.originalModel} to ${OA.fallbackModel}`, "info");
          continue
        }
        throw OA
      }
    }
  } catch (OA) {
    AA(OA instanceof Error ? OA : Error(String(OA)));
    let mA = OA instanceof Error ? OA.message : String(OA);
    GA("tengu_query_error", {
      assistantMessages: w.length,
      toolUses: w.flatMap((wA) => wA.message.content.filter((qA) => qA.type === "tool_use")).length,
      queryChainId: K,
      queryDepth: F.depth
    }), yield* PY1(w, mA), yield JSA({
      toolUse: !1
    }), uN("Query error", OA);
    return
  }
  if (w.length > 0) vX9([...C, ...w], Q, B, G, I, X);
  if (w.some((OA) => OA.message.content.some((mA) => mA.type === "text" && pP2(mA.text)))) GA("tengu_model_response_keyword_detected", {
    is_overly_agreeable: !0,
    queryChainId: K,
    queryDepth: F.depth
  });
  if (I.abortController.signal.aborted) {
    yield* PY1(w, "Interrupted by user"), yield JSA({
      toolUse: !1
    });
    return
  }
  let l = w.flatMap((OA) => OA.message.content.filter((mA) => mA.type === "tool_use"));
  if (!w.length || !l.length) {
    yield* uk3(C, w, Q, B, G, Z, I, X, E, J, W), yield* gk3(C, w, Q, B, G, Z, I, X, E, J);
    return
  }
  let k = !1,
    m = I;
  if (T) {
    GA("tengu_streaming_tool_execution_used", {
      tool_count: l.length,
      queryChainId: K,
      queryDepth: F.depth
    });
    for await (let OA of T.getRemainingResults()) {
      let mA = OA.message;
      if (!mA) continue;
      if (yield mA, mA && mA.type === "attachment" && mA.attachment.type === "hook_stopped_continuation") k = !0;
      N.push(...WZ([mA]).filter((wA) => wA.type === "user"))
    }
    m = {
      ...T.getUpdatedContext(),
      queryTracking: F
    }
  } else {
    GA("tengu_streaming_tool_execution_not_used", {
      tool_count: l.length,
      queryChainId: K,
      queryDepth: F.depth
    });
    for await (let OA of VX0(l, w, Z, I)) {
      if (OA.message) {
        if (yield OA.message, OA.message.type === "attachment" && OA.message.attachment.type === "hook_stopped_continuation") k = !0;
        N.push(...WZ([OA.message]).filter((mA) => mA.type === "user"))
      }
      if (OA.newContext) m = {
        ...OA.newContext,
        queryTracking: F
      }
    }
  }
  if (I.abortController.signal.aborted) {
    let OA = I.abortController.signal.reason === "tool-rejection";
    yield JSA({
      toolUse: !0
    });
    return
  }
  if (k) return;
  if (E?.compacted) E.turnCounter++, GA("tengu_post_autocompact_turn", {
    turnId: E.turnId,
    turnCounter: E.turnCounter,
    queryChainId: K,
    queryDepth: F.depth
  });
  let IA = [...(await m.getAppState()).queuedCommands],
    FA = [];
  GA("tengu_query_before_attachments", {
    messagesForQueryCount: C.length,
    assistantMessagesCount: w.length,
    toolResultsCount: N.length,
    queryChainId: K,
    queryDepth: F.depth
  });
  for await (let OA of jYA(null, m, null, IA, [...C, ...w, ...N], X)) if (yield OA, N.push(OA), u91(OA)) FA.push(OA);
  let zA = N.filter((OA) => OA.type === "attachment" && OA.attachment.type === "edited_text_file").length;
  GA("tengu_query_after_attachments", {
    totalToolResultsCount: N.length,
    fileChangeAttachmentCount: zA,
    queryChainId: K,
    queryDepth: F.depth
  }), s89(IA, m.setAppState);
  let NA = {
    ...m,
    pendingSteeringAttachments: FA.length > 0 ? FA : void 0,
    queryTracking: F
  };
  yield* O$({
    messages: [...C, ...w, ...N],
    systemPrompt: Q,
    userContext: B,
    systemContext: G,
    canUseTool: Z,
    toolUseContext: NA,
    autoCompactTracking: E,
    fallbackModel: J,
    stopHookActive: W,
    querySource: X
  })
}
// @from(Start 13858751, End 13859678)
async function* gk3(A, Q, B, G, Z, I, Y, J, W, X) {
  if (Y.pendingSteeringAttachments && Y.pendingSteeringAttachments.length > 0) {
    let V = [];
    for (let F of Y.pendingSteeringAttachments) {
      let K = F.attachment;
      if (K.type === "queued_command") {
        let D = R0({
          content: K.prompt,
          isMeta: !0
        });
        V.push(D)
      }
    }
    if (V.length > 0) {
      let F = {
        ...Y,
        pendingSteeringAttachments: void 0
      };
      GA("tengu_steering_attachment_resending", {
        queryChainId: Y.queryTracking?.chainId,
        queryDepth: Y.queryTracking?.depth
      }), yield* O$({
        messages: [...A, ...Q, ...V],
        systemPrompt: B,
        userContext: G,
        systemContext: Z,
        canUseTool: I,
        toolUseContext: F,
        autoCompactTracking: W,
        fallbackModel: X,
        querySource: J
      })
    }
    return
  }
}
// @from(Start 13859679, End 13862717)
async function* uk3(A, Q, B, G, Z, I, Y, J, W, X, V) {
  let F = Date.now(),
    K = {
      messages: [...A, ...Q],
      systemPrompt: B,
      userContext: G,
      systemContext: Z,
      toolUseContext: Y,
      querySource: J
    };
  if (gX9(K), !1 !== "false") mX9(K);
  try {
    let D = [],
      C = (await Y.getAppState()).toolPermissionContext.mode,
      E = PV0(C, Y.abortController.signal, void 0, V ?? !1, Y.agentId !== e1() ? Y.agentId : void 0, Y, Q),
      U = "",
      q = 0,
      w = !1,
      N = "",
      R = !1,
      T = [],
      y = [];
    for await (let v of E) {
      if (v.message) {
        if (yield v.message, v.message.type === "progress" && v.message.toolUseID) {
          U = v.message.toolUseID, q++;
          let x = v.message.data;
          if (x.command) y.push({
            command: x.command,
            promptText: x.promptText
          })
        }
        if (v.message.type === "attachment") {
          let x = v.message.attachment;
          if ("hookEvent" in x && (x.hookEvent === "Stop" || x.hookEvent === "SubagentStop")) {
            if (x.type === "hook_non_blocking_error") T.push(x.stderr || `Exit code ${x.exitCode}`), R = !0;
            else if (x.type === "hook_error_during_execution") T.push(x.content), R = !0;
            else if (x.type === "hook_success") {
              if (x.stdout && x.stdout.trim() || x.stderr && x.stderr.trim()) R = !0
            }
          }
        }
      }
      if (v.blockingError) {
        let x = R0({
          content: MV0(v.blockingError),
          isMeta: !0
        });
        D.push(x), yield x, R = !0, T.push(v.blockingError.blockingError)
      }
      if (v.preventContinuation) w = !0, N = v.stopReason || "Stop hook prevented continuation", yield l9({
        type: "hook_stopped_continuation",
        message: N,
        hookName: "Stop",
        toolUseID: U,
        hookEvent: "Stop"
      });
      if (Y.abortController.signal.aborted) {
        GA("tengu_pre_stop_hooks_cancelled", {
          queryChainId: Y.queryTracking?.chainId,
          queryDepth: Y.queryTracking?.depth
        }), yield JSA({
          toolUse: !1
        });
        return
      }
    }
    if (q > 0) {
      if (yield iX9(q, y, T, w, N, R, "suggestion", U), T.length > 0) Y.addNotification?.({
        key: "stop-hook-error",
        text: "Stop hook error occurred · ctrl+o to see",
        priority: "immediate"
      })
    }
    if (w) return;
    if (D.length > 0) yield* O$({
      messages: [...A, ...Q, ...D],
      systemPrompt: B,
      userContext: G,
      systemContext: Z,
      canUseTool: I,
      toolUseContext: Y,
      autoCompactTracking: W,
      fallbackModel: X,
      stopHookActive: !0,
      querySource: J
    })
  } catch (D) {
    let H = Date.now() - F;
    GA("tengu_stop_hook_error", {
      duration: H,
      queryChainId: Y.queryTracking?.chainId,
      queryDepth: Y.queryTracking?.depth
    }), yield $y(`Stop hook failed: ${D instanceof Error?D.message:String(D)}`, "warning")
  }
}
// @from(Start 13862718, End 13863563)
async function* VX0(A, Q, B, G) {
  let Z = G;
  for (let {
      isConcurrencySafe: I,
      blocks: Y
    }
    of mk3(A, Z))
    if (I) {
      let J = {};
      for await (let W of ck3(Y, Q, B, Z)) {
        if (W.contextModifier) {
          let {
            toolUseID: X,
            modifyContext: V
          } = W.contextModifier;
          if (!J[X]) J[X] = [];
          J[X].push(V)
        }
        yield {
          message: W.message,
          newContext: Z
        }
      }
      for (let W of Y) {
        let X = J[W.id];
        if (!X) continue;
        for (let V of X) Z = V(Z)
      }
      yield {
        newContext: Z
      }
    } else
      for await (let J of dk3(Y, Q, B, Z)) {
        if (J.newContext) Z = J.newContext;
        yield {
          message: J.message,
          newContext: Z
        }
      }
}
// @from(Start 13863565, End 13863964)
function mk3(A, Q) {
  return A.reduce((B, G) => {
    let Z = Q.options.tools.find((J) => J.name === G.name),
      I = Z?.inputSchema.safeParse(G.input),
      Y = I?.success ? Boolean(Z?.isConcurrencySafe(I.data)) : !1;
    if (Y && B[B.length - 1]?.isConcurrencySafe) B[B.length - 1].blocks.push(G);
    else B.push({
      isConcurrencySafe: Y,
      blocks: [G]
    });
    return B
  }, [])
}
// @from(Start 13863965, End 13864389)
async function* dk3(A, Q, B, G) {
  let Z = G;
  for (let I of A) {
    G.setInProgressToolUseIDs((Y) => new Set([...Y, I.id]));
    for await (let Y of OY1(I, Q.find((J) => J.message.content.some((W) => W.type === "tool_use" && W.id === I.id)), B, Z)) {
      if (Y.contextModifier) Z = Y.contextModifier.modifyContext(Z);
      yield {
        message: Y.message,
        newContext: Z
      }
    }
    pX9(G, I.id)
  }
}
// @from(Start 13864390, End 13864659)
async function* ck3(A, Q, B, G) {
  yield* SYA(A.map(async function*(Z) {
    G.setInProgressToolUseIDs((I) => new Set([...I, Z.id])), yield* OY1(Z, Q.find((I) => I.message.content.some((Y) => Y.type === "tool_use" && Y.id === Z.id)), B, G), pX9(G, Z.id)
  }), hk3())
}
// @from(Start 13864661, End 13864758)
function pX9(A, Q) {
  A.setInProgressToolUseIDs((B) => new Set([...B].filter((G) => G !== Q)))
}
// @from(Start 13864759, End 13866414)
async function* OY1(A, Q, B, G) {
  let Z = A.name,
    I = G.options.tools.find((W) => W.name === Z),
    Y = Q.message.id;
  if (!I) {
    GA("tengu_tool_use_error", {
      error: `No such tool available: ${Z}`,
      toolName: Z,
      toolUseID: A.id,
      isMcp: Z.startsWith("mcp__"),
      queryChainId: G.queryTracking?.chainId,
      queryDepth: G.queryTracking?.depth
    }), yield {
      message: R0({
        content: [{
          type: "tool_result",
          content: `<tool_use_error>Error: No such tool available: ${Z}</tool_use_error>`,
          is_error: !0,
          tool_use_id: A.id
        }],
        toolUseResult: `Error: No such tool available: ${Z}`
      })
    };
    return
  }
  let J = A.input;
  try {
    if (G.abortController.signal.aborted) {
      GA("tengu_tool_use_cancelled", {
        toolName: I.name,
        toolUseID: A.id,
        isMcp: I.isMcp ?? !1,
        queryChainId: G.queryTracking?.chainId,
        queryDepth: G.queryTracking?.depth
      });
      let W = jV0(A.id);
      yield {
        message: R0({
          content: [W],
          toolUseResult: pXA
        })
      };
      return
    }
    for await (let W of pk3(I, A.id, J, G, B, Q, Y)) yield W
  } catch (W) {
    AA(W instanceof Error ? W : Error(String(W)));
    let X = W instanceof Error ? W.message : String(W),
      F = `Error calling tool${I?` (${I.name})`:""}: ${X}`;
    yield {
      message: R0({
        content: [{
          type: "tool_result",
          content: `<tool_use_error>${F}</tool_use_error>`,
          is_error: !0,
          tool_use_id: A.id
        }],
        toolUseResult: F
      })
    }
  }
}
// @from(Start 13866416, End 13866978)
function pk3(A, Q, B, G, Z, I, Y) {
  let J = new YSA;
  return lk3(A, Q, B, G, Z, I, Y, (W) => {
    GA("tengu_tool_use_progress", {
      messageID: Y,
      toolName: A.name,
      isMcp: A.isMcp ?? !1,
      queryChainId: G.queryTracking?.chainId,
      queryDepth: G.queryTracking?.depth
    }), J.enqueue({
      message: lX9({
        toolUseID: W.toolUseID,
        parentToolUseID: Q,
        data: W.data
      })
    })
  }).then((W) => {
    for (let X of W) J.enqueue(X)
  }).catch((W) => {
    J.error(W)
  }).finally(() => {
    J.done()
  }), J
}
// @from(Start 13866979, End 13875623)
async function lk3(A, Q, B, G, Z, I, Y, J) {
  let W = A.inputSchema.safeParse(B);
  if (!W.success) {
    let N = sk3(A.name, W.error);
    return GA("tengu_tool_use_error", {
      error: "InputValidationError",
      errorDetails: N.slice(0, 2000),
      messageID: Y,
      toolName: A.name,
      isMcp: A.isMcp ?? !1,
      queryChainId: G.queryTracking?.chainId,
      queryDepth: G.queryTracking?.depth
    }), [{
      message: R0({
        content: [{
          type: "tool_result",
          content: `<tool_use_error>InputValidationError: ${N}</tool_use_error>`,
          is_error: !0,
          tool_use_id: Q
        }],
        toolUseResult: `InputValidationError: ${W.error.message}`
      })
    }]
  }
  let X = await A.validateInput?.(W.data, G);
  if (X?.result === !1) return GA("tengu_tool_use_error", {
    messageID: Y,
    toolName: A.name,
    error: X.message,
    errorCode: X.errorCode,
    isMcp: A.isMcp ?? !1,
    queryChainId: G.queryTracking?.chainId,
    queryDepth: G.queryTracking?.depth
  }), [{
    message: R0({
      content: [{
        type: "tool_result",
        content: `<tool_use_error>${X.message}</tool_use_error>`,
        is_error: !0,
        tool_use_id: Q
      }],
      toolUseResult: `Error: ${X.message}`
    })
  }];
  let V = [],
    F = W.data,
    K = !1,
    D, H;
  for await (let N of ak3(G, A, F, Q, I.message.id)) switch (N.type) {
    case "message":
      if (N.message.message.type === "progress") J(N.message.message);
      else V.push(N.message);
      break;
    case "hookPermissionResult":
      H = N.hookPermissionResult;
      break;
    case "preventContinuation":
      K = N.shouldPreventContinuation;
      break;
    case "stopReason":
      D = N.stopReason;
      break;
    case "stop":
      return V.push({
        message: R0({
          content: [jV0(Q)],
          toolUseResult: `Error: ${D}`
        })
      }), V
  }
  let C = {};
  if (F && typeof F === "object") {
    if (A.name === d5 && "file_path" in F) C.file_path = String(F.file_path);
    else if ((A.name === $5 || A.name === wX) && "file_path" in F) C.file_path = String(F.file_path);
    else if (A.name === C9 && "command" in F) {
      let N = F;
      C.full_command = N.command
    }
  }
  sM2(A.name, C), rM2();
  let E;
  if (H !== void 0 && H.behavior === "allow") g(`Hook approved tool use for ${A.name}, bypassing permission check`), E = H;
  else if (H !== void 0 && H.behavior === "deny") g(`Hook denied tool use for ${A.name}`), E = H;
  else {
    let N = H?.behavior === "ask" ? H : void 0;
    E = await Z(A, F, G, I, Q, N)
  }
  if (E.decisionReason?.type === "hook" && E.decisionReason.hookName === "PermissionRequest" && E.behavior !== "ask") V.push({
    message: l9({
      type: "hook_permission_decision",
      decision: E.behavior,
      toolUseID: Q,
      hookEvent: "PermissionRequest"
    })
  });
  if (E.behavior !== "allow") {
    let N = G.toolDecisions?.get(Q);
    F80("reject", N?.source || "unknown"), V61(), GA("tengu_tool_use_can_use_tool_rejected", {
      messageID: Y,
      toolName: A.name,
      queryChainId: G.queryTracking?.chainId,
      queryDepth: G.queryTracking?.depth
    });
    let R = E.message;
    if (K && !R) R = `Execution stopped by PreToolUse hook${D?`: ${D}`:""}`;
    return V.push({
      message: R0({
        content: [{
          type: "tool_result",
          content: R,
          is_error: !0,
          tool_use_id: Q
        }],
        toolUseResult: `Error: ${R}`
      })
    }), V
  }
  GA("tengu_tool_use_can_use_tool_allowed", {
    messageID: Y,
    toolName: A.name,
    queryChainId: G.queryTracking?.chainId,
    queryDepth: G.queryTracking?.depth
  }), F = E.updatedInput;
  let U = {};
  if (A.name === C9 && "command" in F) {
    let N = F;
    U = {
      bash_command: N.command.trim().split(/\s+/)[0] || "",
      full_command: N.command,
      ...N.timeout !== void 0 && {
        timeout: N.timeout
      },
      ...N.description !== void 0 && {
        description: N.description
      },
      ..."dangerouslyDisableSandbox" in N && {
        dangerouslyDisableSandbox: N.dangerouslyDisableSandbox
      }
    }
  }
  let q = G.toolDecisions?.get(Q);
  F80(q?.decision || "unknown", q?.source || "unknown"), oM2();
  let w = Date.now();
  try {
    let N = await A.call(F, {
        ...G,
        userModified: E.userModified ?? !1
      }, Z, I, (u) => {
        GA("tengu_tool_use_progress", {
          messageID: I.message.id,
          toolName: A.name,
          isMcp: A.isMcp ?? !1
        }), J({
          toolUseID: u.toolUseID,
          data: u.data
        })
      }),
      R = Date.now() - w;
    if (NX1(R), N.data && typeof N.data === "object") {
      let u = {};
      if (A.name === d5 && "content" in N.data) {
        if ("file_path" in F) u.file_path = String(F.file_path);
        u.content = String(N.data.content)
      }
      if ((A.name === $5 || A.name === wX) && "file_path" in F) {
        if (u.file_path = String(F.file_path), A.name === $5 && "diff" in N.data) u.diff = String(N.data.diff);
        if (A.name === wX && "content" in F) u.content = String(F.content)
      }
      if (A.name === C9 && "command" in F) {
        let e = F;
        if (u.bash_command = e.command, "output" in N.data) u.output = String(N.data.output)
      }
      if (Object.keys(u).length > 0) tM2("tool.output", u)
    }
    if (typeof N === "object" && "structured_output" in N) V.push({
      message: l9({
        type: "structured_output",
        data: N.structured_output
      })
    });
    K80({
      success: !0
    }), V61();
    let T = 0;
    try {
      T = JSON.stringify(N.data).length
    } catch (u) {
      AA(u instanceof Error ? u : Error(String(u)))
    }
    GA("tengu_tool_use_success", {
      messageID: Y,
      toolName: A.name,
      isMcp: A.isMcp ?? !1,
      durationMs: R,
      queryChainId: G.queryTracking?.chainId,
      queryDepth: G.queryTracking?.depth
    }), HO("tool_result", {
      tool_name: A.name,
      success: "true",
      duration_ms: String(R),
      ...Object.keys(U).length > 0 && {
        tool_parameters: JSON.stringify(U)
      },
      tool_result_size_bytes: String(T),
      ...q && {
        decision_source: q.source,
        decision_type: q.decision
      }
    });
    let y = N.data,
      v = [],
      x = N.contextModifier;
    async function p(u) {
      V.push({
        message: R0({
          content: [await kX9(A, u, Q)],
          toolUseResult: u
        }),
        contextModifier: x ? {
          toolUseID: Q,
          modifyContext: x
        } : void 0
      })
    }
    if (!lg(A)) await p(y);
    for await (let u of ik3(G, A, Q, I.message.id, E, y)) if ("updatedMCPToolOutput" in u) {
      if (lg(A)) y = u.updatedMCPToolOutput
    } else if (lg(A)) v.push(u);
    else V.push(u);
    if (lg(A)) await p(y);
    if (N.newMessages && N.newMessages.length > 0)
      for (let u of N.newMessages) V.push({
        message: u
      });
    if (K) V.push({
      message: l9({
        type: "hook_stopped_continuation",
        message: D || "Execution stopped by hook",
        hookName: `PreToolUse:${A.name}`,
        toolUseID: Q,
        hookEvent: "PreToolUse"
      })
    });
    for (let u of v) V.push(u);
    return V
  } catch (N) {
    let R = Date.now() - w;
    if (NX1(R), K80({
        success: !1,
        error: N instanceof Error ? N.message : String(N)
      }), V61(), !(N instanceof WW)) {
      if (!(N instanceof tj)) AA(N instanceof Error ? N : Error(String(N)));
      GA("tengu_tool_use_error", {
        messageID: Y,
        toolName: A.name,
        error: N instanceof Error ? N.constructor.name : "UnknownError",
        isMcp: A.isMcp ?? !1,
        queryChainId: G.queryTracking?.chainId,
        queryDepth: G.queryTracking?.depth
      }), HO("tool_result", {
        tool_name: A.name,
        use_id: Q,
        success: "false",
        duration_ms: String(R),
        error: N instanceof Error ? N.message : String(N),
        ...Object.keys(U).length > 0 && {
          tool_parameters: JSON.stringify(U)
        },
        ...q && {
          decision_source: q.source,
          decision_type: q.decision
        }
      })
    }
    let T = jY1(N),
      y = N instanceof WW,
      v = [];
    for await (let x of nk3(G, A, Q, Y, F, T, y)) v.push(x);
    return [{
      message: R0({
        content: [{
          type: "tool_result",
          content: T,
          is_error: !0,
          tool_use_id: Q
        }],
        toolUseResult: `Error: ${T}`
      })
    }, ...v]
  } finally {
    if (q) G.toolDecisions?.delete(Q)
  }
}
// @from(Start 13875624, End 13878075)
async function* ik3(A, Q, B, G, Z, I) {
  let Y = Date.now();
  try {
    let W = (await A.getAppState()).toolPermissionContext.mode,
      X = I;
    for await (let V of RV0(Q.name, B, Z.updatedInput, X, A, W, A.abortController.signal)) try {
      if (V.message?.type === "attachment" && V.message.attachment.type === "hook_cancelled") {
        GA("tengu_post_tool_hooks_cancelled", {
          toolName: Q.name,
          queryChainId: A.queryTracking?.chainId,
          queryDepth: A.queryTracking?.depth
        }), yield {
          message: l9({
            type: "hook_cancelled",
            hookName: `PostToolUse:${Q.name}`,
            toolUseID: B,
            hookEvent: "PostToolUse"
          })
        };
        continue
      }
      if (V.message) yield {
        message: V.message
      };
      if (V.blockingError) yield {
        message: l9({
          type: "hook_blocking_error",
          hookName: `PostToolUse:${Q.name}`,
          toolUseID: B,
          hookEvent: "PostToolUse",
          blockingError: V.blockingError
        })
      };
      if (V.preventContinuation) {
        yield {
          message: l9({
            type: "hook_stopped_continuation",
            message: V.stopReason || "Execution stopped by PostToolUse hook",
            hookName: `PostToolUse:${Q.name}`,
            toolUseID: B,
            hookEvent: "PostToolUse"
          })
        };
        return
      }
      if (V.additionalContexts && V.additionalContexts.length > 0) yield {
        message: l9({
          type: "hook_additional_context",
          content: V.additionalContexts,
          hookName: `PostToolUse:${Q.name}`,
          toolUseID: B,
          hookEvent: "PostToolUse"
        })
      };
      if (V.updatedMCPToolOutput && lg(Q)) X = V.updatedMCPToolOutput, yield {
        updatedMCPToolOutput: X
      }
    } catch (F) {
      let K = Date.now() - Y;
      GA("tengu_post_tool_hook_error", {
        messageID: G,
        toolName: Q.name,
        isMcp: Q.isMcp ?? !1,
        duration: K,
        queryChainId: A.queryTracking?.chainId,
        queryDepth: A.queryTracking?.depth
      }), yield {
        message: l9({
          type: "hook_error_during_execution",
          content: jY1(F),
          hookName: `PostToolUse:${Q.name}`,
          toolUseID: B,
          hookEvent: "PostToolUse"
        })
      }
    }
  } catch (J) {
    AA(J instanceof Error ? J : Error(String(J)))
  }
}
// @from(Start 13878076, End 13880102)
async function* nk3(A, Q, B, G, Z, I, Y) {
  let J = Date.now();
  try {
    let X = (await A.getAppState()).toolPermissionContext.mode;
    for await (let V of TV0(Q.name, B, Z, I, A, Y, X, A.abortController.signal)) try {
      if (V.message?.type === "attachment" && V.message.attachment.type === "hook_cancelled") {
        GA("tengu_post_tool_failure_hooks_cancelled", {
          toolName: Q.name,
          queryChainId: A.queryTracking?.chainId,
          queryDepth: A.queryTracking?.depth
        }), yield {
          message: l9({
            type: "hook_cancelled",
            hookName: `PostToolUseFailure:${Q.name}`,
            toolUseID: B,
            hookEvent: "PostToolUseFailure"
          })
        };
        continue
      }
      if (V.message) yield {
        message: V.message
      };
      if (V.blockingError) yield {
        message: l9({
          type: "hook_blocking_error",
          hookName: `PostToolUseFailure:${Q.name}`,
          toolUseID: B,
          hookEvent: "PostToolUseFailure",
          blockingError: V.blockingError
        })
      };
      if (V.additionalContexts && V.additionalContexts.length > 0) yield {
        message: l9({
          type: "hook_additional_context",
          content: V.additionalContexts,
          hookName: `PostToolUseFailure:${Q.name}`,
          toolUseID: B,
          hookEvent: "PostToolUseFailure"
        })
      }
    } catch (F) {
      let K = Date.now() - J;
      GA("tengu_post_tool_failure_hook_error", {
        messageID: G,
        toolName: Q.name,
        isMcp: Q.isMcp ?? !1,
        duration: K,
        queryChainId: A.queryTracking?.chainId,
        queryDepth: A.queryTracking?.depth
      }), yield {
        message: l9({
          type: "hook_error_during_execution",
          content: jY1(F),
          hookName: `PostToolUseFailure:${Q.name}`,
          toolUseID: B,
          hookEvent: "PostToolUseFailure"
        })
      }
    }
  } catch (W) {
    AA(W instanceof Error ? W : Error(String(W)))
  }
}
// @from(Start 13880103, End 13883304)
async function* ak3(A, Q, B, G, Z) {
  let I = Date.now();
  try {
    let Y = await A.getAppState();
    for await (let J of OV0(Q.name, G, B, A, Y.toolPermissionContext.mode, A.abortController.signal)) try {
      if (J.message) yield {
        type: "message",
        message: {
          message: J.message
        }
      };
      if (J.blockingError) {
        let W = LV0(`PreToolUse:${Q.name}`, J.blockingError);
        yield {
          type: "hookPermissionResult",
          hookPermissionResult: {
            behavior: "deny",
            message: W,
            decisionReason: {
              type: "hook",
              hookName: `PreToolUse:${Q.name}`,
              reason: W
            }
          }
        }
      }
      if (J.preventContinuation) {
        if (yield {
            type: "preventContinuation",
            shouldPreventContinuation: !0
          }, J.stopReason) yield {
          type: "stopReason",
          stopReason: J.stopReason
        }
      }
      if (J.permissionBehavior !== void 0) {
        g(`Hook result has permissionBehavior=${J.permissionBehavior}`);
        let W = {
          type: "hook",
          hookName: `PreToolUse:${Q.name}`,
          reason: J.hookPermissionDecisionReason
        };
        if (J.permissionBehavior === "allow") yield {
          type: "hookPermissionResult",
          hookPermissionResult: {
            behavior: "allow",
            updatedInput: J.updatedInput || B,
            decisionReason: W
          }
        };
        else yield {
          type: "hookPermissionResult",
          hookPermissionResult: {
            behavior: J.permissionBehavior,
            message: J.hookPermissionDecisionReason || `Hook PreToolUse:${Q.name} ${Qj2(J.permissionBehavior)} this tool`,
            decisionReason: W
          }
        }
      }
      if (A.abortController.signal.aborted) {
        GA("tengu_pre_tool_hooks_cancelled", {
          toolName: Q.name,
          queryChainId: A.queryTracking?.chainId,
          queryDepth: A.queryTracking?.depth
        }), yield {
          type: "message",
          message: {
            message: l9({
              type: "hook_cancelled",
              hookName: `PreToolUse:${Q.name}`,
              toolUseID: G,
              hookEvent: "PreToolUse"
            })
          }
        }, yield {
          type: "stop"
        };
        return
      }
    } catch (W) {
      AA(W instanceof Error ? W : Error(String(W)));
      let X = Date.now() - I;
      GA("tengu_pre_tool_hook_error", {
        messageID: Z,
        toolName: Q.name,
        isMcp: Q.isMcp ?? !1,
        duration: X,
        queryChainId: A.queryTracking?.chainId,
        queryDepth: A.queryTracking?.depth
      }), yield {
        type: "message",
        message: {
          message: l9({
            type: "hook_error_during_execution",
            content: jY1(W),
            hookName: `PreToolUse:${Q.name}`,
            toolUseID: G,
            hookEvent: "PreToolUse"
          })
        }
      }, yield {
        type: "stop"
      }
    }
  } catch (Y) {
    AA(Y instanceof Error ? Y : Error(String(Y))), yield {
      type: "stop"
    };
    return
  }
}
// @from(Start 13883306, End 13883668)
function jY1(A) {
  if (A instanceof WW) return A.message || xO;
  if (!(A instanceof Error)) return String(A);
  let B = NV0(A).filter(Boolean).join(`
`).trim() || "Command failed with no output";
  if (B.length <= 1e4) return B;
  let G = 5000,
    Z = B.slice(0, G),
    I = B.slice(-G);
  return `${Z}

... [${B.length-1e4} characters truncated] ...

${I}`
}
// @from(Start 13883670, End 13883965)
function NV0(A) {
  if (A instanceof tj) return [`Exit code ${A.code}`, A.interrupted ? xO : "", A.stderr, A.stdout];
  let Q = [A.message];
  if ("stderr" in A && typeof A.stderr === "string") Q.push(A.stderr);
  if ("stdout" in A && typeof A.stdout === "string") Q.push(A.stdout);
  return Q
}
// @from(Start 13883967, End 13884150)
function cX9(A) {
  if (A.length === 0) return "";
  return A.reduce((Q, B, G) => {
    if (typeof B === "number") return `${Q}[${B}]`;
    return G === 0 ? B : `${Q}.${B}`
  }, "")
}
// @from(Start 13884152, End 13885279)
function sk3(A, Q) {
  let B = Q.errors.filter((J) => J.code === "invalid_type" && J.received === "undefined" && J.message === "Required").map((J) => cX9(J.path)),
    G = Q.errors.filter((J) => J.code === "unrecognized_keys").flatMap((J) => J.keys),
    Z = Q.errors.filter((J) => J.code === "invalid_type" && ("received" in J) && J.received !== "undefined" && J.message !== "Required").map((J) => {
      let W = J;
      return {
        param: cX9(J.path),
        expected: W.expected,
        received: W.received
      }
    }),
    I = Q.message,
    Y = [];
  if (B.length > 0) {
    let J = B.map((W) => `The required parameter \`${W}\` is missing`);
    Y.push(...J)
  }
  if (G.length > 0) {
    let J = G.map((W) => `An unexpected parameter \`${W}\` was provided`);
    Y.push(...J)
  }
  if (Z.length > 0) {
    let J = Z.map(({
      param: W,
      expected: X,
      received: V
    }) => `The parameter \`${W}\` type is expected as \`${X}\` but provided as \`${V}\``);
    Y.push(...J)
  }
  if (Y.length > 0) I = `${A} failed due to the following ${Y.length>1?"issues":"issue"}:
${Y.join(`
`)}`;
  return I
}
// @from(Start 13885284, End 13885588)
Ca = L(() => {
  fZ();
  b60();
  v1A();
  y1A();
  u2();
  q0();
  u60();
  oJA();
  F0A();
  _0();
  wF();
  YS();
  PX9();
  RZ();
  _i();
  g1();
  V0();
  LY1();
  cQ();
  th();
  IO();
  _0();
  t2();
  GO();
  YO();
  ISA();
  bjA();
  bX9();
  fX9();
  $V0();
  wV0();
  nX();
  RQA();
  qV0()
})
// @from(Start 13885636, End 13891932)
async function aX9(A, Q, B, G, Z, I, Y, J) {
  let W = Y || `hook-${nX9()}`,
    X = I.agentId !== e1() ? DVA(I.agentId) : aJA(),
    V = Date.now();
  try {
    let F = r61(A.prompt(J), G);
    g(`Hooks: Processing agent hook with prompt: ${F}`);
    let K = {
        ...I,
        onChangeAPIKey: () => {},
        onChangeDynamicMcpConfig: void 0,
        onInstallIDEExtension: void 0,
        resume: void 0,
        options: {
          ...I.options,
          dynamicMcpConfig: void 0,
          ideInstallationStatus: null,
          theme: "dark"
        }
      },
      D = await TP({
        input: F,
        mode: "prompt",
        setIsLoading: () => {},
        setToolJSX: () => {},
        context: K
      });
    if (!D.shouldQuery) {
      let R = D.messages.map((T) => {
        if (T.type === "user" && T.message?.content) {
          if (typeof T.message.content === "string") return T.message.content;
          return T.message.content.filter((y) => y.type === "text").map((y) => y.text).join("")
        }
        return ""
      }).join(`
`);
      return {
        hook: A,
        outcome: "success",
        message: l9({
          type: "hook_success",
          hookName: Q,
          toolUseID: W,
          hookEvent: B,
          content: R
        })
      }
    }
    let H = D.messages;
    g(`Hooks: Starting agent query with ${H.length} messages`);
    let C = A.timeout ? A.timeout * 1000 : 60000,
      E = o9(),
      {
        signal: U,
        cleanup: q
      } = ck(Z, AbortSignal.timeout(C)),
      w = () => E.abort();
    U.addEventListener("abort", w);
    let N = E.signal;
    try {
      let R = rk3(),
        y = [...I.options.tools.filter((o) => o.name !== Az).filter((o) => !CTA.has(o.name)), R],
        v = [`You are verifying a stop condition in Claude Code. Your task is to verify that the agent completed the given plan. The conversation transcript is available at: ${X}
You can read this file to analyze the conversation history if needed.

Use the available tools to inspect the codebase and verify the condition.
Use as few steps as possible - be efficient and direct.

When done, return your result using the ${Az} tool with:
- ok: true if the condition is met
- ok: false with reason if the condition is not met`],
        x = A.model ?? MW(),
        p = 50,
        u = `hook-agent-${nX9()}`,
        e = {
          ...I,
          agentId: u,
          abortController: E,
          options: {
            ...I.options,
            tools: y,
            mainLoopModel: x,
            isNonInteractiveSession: !0,
            maxThinkingTokens: 0
          },
          setInProgressToolUseIDs: () => {},
          async getAppState() {
            let o = await I.getAppState(),
              IA = o.toolPermissionContext.alwaysAllowRules.session ?? [];
            return {
              ...o,
              toolPermissionContext: {
                ...o.toolPermissionContext,
                mode: "dontAsk",
                alwaysAllowRules: {
                  ...o.toolPermissionContext.alwaysAllowRules,
                  session: [...IA, `Read(/${X})`]
                }
              }
            }
          }
        };
      s21(I.setAppState, u, "Stop", "", (o) => bI1(o, Az), `You MUST call the ${Az} tool to complete this request. Call this tool now.`, {
        timeout: 5000
      });
      let l = null,
        k = 0,
        m = !1;
      for await (let o of O$({
        messages: H,
        systemPrompt: v,
        userContext: {},
        systemContext: {},
        canUseTool: M$,
        toolUseContext: e,
        querySource: "hook_agent"
      })) {
        if (fQA(o, () => {}, (IA) => I.setResponseLength((FA) => FA + IA.length), I.setStreamMode ?? (() => {}), () => {}), o.type === "stream_event" || o.type === "stream_request_start") continue;
        if (o.type === "assistant") {
          if (k++, k >= 50) {
            m = !0, g(`Hooks: Agent turn ${k} hit max turns, aborting`), E.abort();
            break
          }
        }
        if (o.type === "attachment" && o.attachment.type === "structured_output") {
          let IA = hRA.safeParse(o.attachment.data);
          if (IA.success) {
            l = IA.data, g(`Hooks: Got structured output: ${JSON.stringify(l)}`), E.abort();
            break
          }
        }
      }
      if (U.removeEventListener("abort", w), q(), o21(I.setAppState, u), !l) {
        if (m) return g("Hooks: Agent hook did not complete within 50 turns"), GA("tengu_agent_stop_hook_max_turns", {
          durationMs: Date.now() - V,
          turnCount: k
        }), {
          hook: A,
          outcome: "cancelled"
        };
        return g("Hooks: Agent hook did not return structured output"), GA("tengu_agent_stop_hook_error", {
          durationMs: Date.now() - V,
          turnCount: k,
          errorType: 1
        }), {
          hook: A,
          outcome: "cancelled"
        }
      }
      if (!l.ok) return g(`Hooks: Agent hook condition was not met: ${l.reason}`), {
        hook: A,
        outcome: "blocking",
        blockingError: {
          blockingError: `Agent hook condition was not met: ${l.reason}`,
          command: A.prompt(J)
        }
      };
      return g("Hooks: Agent hook condition was met"), GA("tengu_agent_stop_hook_success", {
        durationMs: Date.now() - V,
        turnCount: k
      }), {
        hook: A,
        outcome: "success",
        message: l9({
          type: "hook_success",
          hookName: Q,
          toolUseID: W,
          hookEvent: B,
          content: "Condition met"
        })
      }
    } catch (R) {
      if (U.removeEventListener("abort", w), q(), N.aborted) return {
        hook: A,
        outcome: "cancelled"
      };
      throw R
    }
  } catch (F) {
    let K = F instanceof Error ? F.message : String(F);
    return g(`Hooks: Agent hook error: ${K}`), GA("tengu_agent_stop_hook_error", {
      durationMs: Date.now() - V,
      errorType: 2
    }), {
      hook: A,
      outcome: "non_blocking_error",
      message: l9({
        type: "hook_non_blocking_error",
        hookName: Q,
        toolUseID: W,
        hookEvent: B,
        stderr: `Error executing agent hook: ${K}`,
        stdout: "",
        exitCode: 1
      })
    }
  }
}
// @from(Start 13891934, End 13892518)
function rk3() {
  return {
    ...IX0,
    inputSchema: hRA,
    inputJSONSchema: {
      type: "object",
      properties: {
        ok: {
          type: "boolean",
          description: "Whether the condition was met"
        },
        reason: {
          type: "string",
          description: "Reason, if the condition was not met"
        }
      },
      required: ["ok"],
      additionalProperties: !1
    },
    async prompt() {
      return "Use this tool to return your verification result. You MUST call this tool exactly once at the end of your response."
    }
  }
}
// @from(Start 13892523, End 13892673)
sX9 = L(() => {
  V0();
  AWA();
  AZ();
  Ca();
  t2();
  IO();
  q0();
  eXA();
  OZ();
  B91();
  y60();
  _0();
  S7();
  cQ();
  yq();
  jMA()
})
// @from(Start 13892679, End 13892687)
eX9 = {}
// @from(Start 13893459, End 13893519)
function rX9() {
  if (!!N6()) return !1;
  return !TJ(!1)
}
// @from(Start 13893521, End 13893664)
function tE(A, Q) {
  let B = Q ?? e1();
  return {
    session_id: B,
    transcript_path: WSA(B),
    cwd: W0(),
    permission_mode: A
  }
}
// @from(Start 13893666, End 13895106)
function oX9(A) {
  let Q = A.trim();
  if (!Q.startsWith("{")) return g("Hook output does not start with {, treating as plain text"), {
    plainText: A
  };
  try {
    let B = JSON.parse(Q),
      G = Q91.safeParse(B);
    if (G.success) return g("Successfully parsed and validated hook JSON output"), {
      json: G.data
    };
    else {
      let I = `Hook JSON output validation failed:
${G.error.errors.map((Y)=>`  - ${Y.path.join(".")}: ${Y.message}`).join(`
`)}

Expected schema:
${JSON.stringify({continue:"boolean (optional)",suppressOutput:"boolean (optional)",stopReason:"string (optional)",decision:'"approve" | "block" (optional)',reason:"string (optional)",systemMessage:"string (optional)",permissionDecision:'"allow" | "deny" | "ask" (optional)',hookSpecificOutput:{"for PreToolUse":{hookEventName:'"PreToolUse"',permissionDecision:'"allow" | "deny" | "ask" (optional)',permissionDecisionReason:"string (optional)",updatedInput:"object (optional) - Modified tool input to use"},"for UserPromptSubmit":{hookEventName:'"UserPromptSubmit"',additionalContext:"string (required)"},"for PostToolUse":{hookEventName:'"PostToolUse"',additionalContext:"string (optional)"}}},null,2)}. The hook's stdout was: ${JSON.stringify(B,null,2)}`;
      return g(I), {
        plainText: A,
        validationError: I
      }
    }
  } catch (B) {
    return g(`Failed to parse hook output as JSON: ${B}`), {
      plainText: A
    }
  }
}
// @from(Start 13895108, End 13899115)
function tX9({
  json: A,
  command: Q,
  hookName: B,
  toolUseID: G,
  hookEvent: Z,
  expectedHookEvent: I,
  stdout: Y,
  stderr: J,
  exitCode: W
}) {
  let X = {},
    V = A;
  if (V.continue === !1) {
    if (X.preventContinuation = !0, V.stopReason) X.stopReason = V.stopReason
  }
  if (A.decision) switch (A.decision) {
    case "approve":
      X.permissionBehavior = "allow";
      break;
    case "block":
      X.permissionBehavior = "deny", X.blockingError = {
        blockingError: A.reason || "Blocked by hook",
        command: Q
      };
      break;
    default:
      throw Error(`Unknown hook decision type: ${A.decision}. Valid types are: approve, block`)
  }
  if (A.systemMessage) X.systemMessage = A.systemMessage;
  if (A.hookSpecificOutput?.hookEventName === "PreToolUse" && A.hookSpecificOutput.permissionDecision) switch (A.hookSpecificOutput.permissionDecision) {
    case "allow":
      X.permissionBehavior = "allow";
      break;
    case "deny":
      X.permissionBehavior = "deny", X.blockingError = {
        blockingError: A.reason || "Blocked by hook",
        command: Q
      };
      break;
    case "ask":
      X.permissionBehavior = "ask";
      break;
    default:
      throw Error(`Unknown hook permissionDecision type: ${A.hookSpecificOutput.permissionDecision}. Valid types are: allow, deny, ask`)
  }
  if (X.permissionBehavior !== void 0 && A.reason !== void 0) X.hookPermissionDecisionReason = A.reason;
  if (A.hookSpecificOutput) {
    if (I && A.hookSpecificOutput.hookEventName !== I) throw Error(`Hook returned incorrect event name: expected '${I}' but got '${A.hookSpecificOutput.hookEventName}'. Full stdout: ${JSON.stringify(A,null,2)}`);
    switch (A.hookSpecificOutput.hookEventName) {
      case "PreToolUse":
        if (A.hookSpecificOutput.permissionDecision) switch (A.hookSpecificOutput.permissionDecision) {
          case "allow":
            X.permissionBehavior = "allow";
            break;
          case "deny":
            X.permissionBehavior = "deny", X.blockingError = {
              blockingError: A.hookSpecificOutput.permissionDecisionReason || A.reason || "Blocked by hook",
              command: Q
            };
            break;
          case "ask":
            X.permissionBehavior = "ask";
            break
        }
        if (X.hookPermissionDecisionReason = A.hookSpecificOutput.permissionDecisionReason, A.hookSpecificOutput.updatedInput) X.updatedInput = A.hookSpecificOutput.updatedInput;
        break;
      case "UserPromptSubmit":
        X.additionalContext = A.hookSpecificOutput.additionalContext;
        break;
      case "SessionStart":
        X.additionalContext = A.hookSpecificOutput.additionalContext;
        break;
      case "SubagentStart":
        X.additionalContext = A.hookSpecificOutput.additionalContext;
        break;
      case "PostToolUse":
        if (X.additionalContext = A.hookSpecificOutput.additionalContext, A.hookSpecificOutput.updatedMCPToolOutput) X.updatedMCPToolOutput = A.hookSpecificOutput.updatedMCPToolOutput;
        break;
      case "PostToolUseFailure":
        X.additionalContext = A.hookSpecificOutput.additionalContext;
        break;
      case "PermissionRequest":
        if (A.hookSpecificOutput.decision) {
          if (X.permissionRequestResult = A.hookSpecificOutput.decision, X.permissionBehavior = A.hookSpecificOutput.decision.behavior === "allow" ? "allow" : "deny", A.hookSpecificOutput.decision.behavior === "allow" && A.hookSpecificOutput.decision.updatedInput) X.updatedInput = A.hookSpecificOutput.decision.updatedInput
        }
        break
    }
  }
  return {
    ...X,
    message: X.blockingError ? l9({
      type: "hook_blocking_error",
      hookName: B,
      toolUseID: G,
      hookEvent: Z,
      blockingError: X.blockingError
    }) : l9({
      type: "hook_success",
      hookName: B,
      toolUseID: G,
      hookEvent: Z,
      content: "Success",
      stdout: Y,
      stderr: J,
      exitCode: W
    })
  }
}
// @from(Start 13899116, End 13901894)
async function SV0(A, Q, B, G, Z, I) {
  let Y = uQ(),
    J = process.env.CLAUDE_CODE_SHELL_PREFIX ? NsA(process.env.CLAUDE_CODE_SHELL_PREFIX, A.command) : A.command,
    W = A.timeout ? A.timeout * 1000 : 60000,
    X = {
      ...process.env,
      CLAUDE_PROJECT_DIR: Y
    };
  if (Q === "SessionStart" && I !== void 0) X.CLAUDE_ENV_FILE = LsA(I);
  let V = ok3(J, [], {
      env: X,
      cwd: W0(),
      shell: !0
    }),
    F = qsA(V, Z, W),
    K = "",
    D = "";
  V.stdout.setEncoding("utf8"), V.stderr.setEncoding("utf8");
  let H = !1,
    C = null,
    E = new Promise((N) => {
      C = N
    });
  V.stdout.on("data", (N) => {
    if (K += N, !H && K.trim().includes("}")) {
      H = !0, g(`Hooks: Checking initial response for async: ${K.trim()}`);
      try {
        let R = JSON.parse(K.trim());
        if (g(`Hooks: Parsed initial response: ${JSON.stringify(R)}`), zYA(R)) {
          let T = `async_hook_${V.pid}`;
          g(`Hooks: Detected async hook, backgrounding process ${T}`);
          let y = F.background(T);
          if (y) yZ2({
            processId: T,
            asyncResponse: R,
            hookEvent: Q,
            hookName: B,
            command: A.command,
            shellCommand: F
          }), y.stdoutStream.on("data", (v) => {
            xZ2(T, v.toString())
          }), y.stderrStream.on("data", (v) => {
            vZ2(T, v.toString())
          }), C?.({
            stdout: K,
            stderr: D,
            status: 0
          })
        } else g("Hooks: Initial response is not async, continuing normal processing")
      } catch (R) {
        g(`Hooks: Failed to parse initial response as JSON: ${R}`)
      }
    }
  }), V.stderr.on("data", (N) => {
    D += N
  });
  let U = new Promise((N, R) => {
      V.stdin.on("error", R), V.stdin.write(G, "utf8"), V.stdin.end(), N()
    }),
    q = new Promise((N, R) => {
      V.on("error", R)
    }),
    w = new Promise((N) => {
      V.on("close", (R) => {
        N({
          stdout: K,
          stderr: D,
          status: R ?? 1,
          aborted: Z.aborted
        })
      })
    });
  try {
    return await Promise.race([U, q]), await Promise.race([E, w, q])
  } catch (N) {
    let R = N;
    if (R.code === "EPIPE") return g("EPIPE error while writing to hook stdin (hook command likely closed early)"), {
      stdout: "",
      stderr: "Hook command closed stdin before hook input was fully written (EPIPE)",
      status: 1
    };
    else if (R.code === "ABORT_ERR") return {
      stdout: "",
      stderr: "Hook cancelled",
      status: 1,
      aborted: !0
    };
    else return {
      stdout: "",
      stderr: `Error occurred while executing hook command: ${N instanceof Error?N.message:String(N)}`,
      status: 1
    }
  }
}
// @from(Start 13901896, End 13902211)
function tk3(A, Q) {
  if (!Q || Q === "*") return !0;
  if (/^[a-zA-Z0-9_|]+$/.test(Q)) {
    if (Q.includes("|")) return Q.split("|").map((G) => G.trim()).includes(A);
    return A === Q
  }
  try {
    return new RegExp(Q).test(A)
  } catch {
    return g(`Invalid regex pattern in hook matcher: ${Q}`), !1
  }
}
// @from(Start 13902213, End 13902860)
function ek3(A) {
  let Q = {},
    B = SZ2();
  if (B)
    for (let [G, Z] of Object.entries(B)) Q[G] = Z.map((I) => ({
      matcher: I.matcher,
      hooks: I.hooks
    }));
  if (!t21()) {
    let G = MkA();
    if (G)
      for (let [Z, I] of Object.entries(G)) {
        if (!Q[Z]) Q[Z] = [];
        for (let Y of I) Q[Z].push({
          matcher: Y.matcher,
          hooks: Y.hooks
        })
      }
  }
  if (A) {
    let G = e1(),
      Z = r21(A, G);
    for (let [I, Y] of Z.entries()) {
      if (!Q[I]) Q[I] = [];
      for (let J of Y) Q[I].push({
        matcher: J.matcher,
        hooks: J.hooks
      })
    }
  }
  return Q
}
// @from(Start 13902862, End 13904316)
function _V0(A, Q, B) {
  try {
    let Z = ek3(A)?.[Q] ?? [],
      I = void 0;
    switch (B.hook_event_name) {
      case "PreToolUse":
      case "PostToolUse":
      case "PostToolUseFailure":
      case "PermissionRequest":
        I = B.tool_name;
        break;
      case "SessionStart":
        I = B.source;
        break;
      case "PreCompact":
        I = B.trigger;
        break;
      case "Notification":
        I = B.notification_type;
        break;
      case "SessionEnd":
        I = B.reason;
        break;
      case "SubagentStart":
        I = B.agent_type;
        break;
      default:
        break
    }
    g(`Getting matching hook commands for ${Q} with query: ${I}`), g(`Found ${Z.length} hook matchers in settings`);
    let Y;
    if (!I) Y = Z.flatMap((K) => K.hooks);
    else Y = Z.filter((K) => !K.matcher || tk3(I, K.matcher)).flatMap((K) => K.hooks);
    let J = Array.from(new Map(Y.filter((K) => K.type === "command").map((K) => [K.command, K])).values()),
      W = Array.from(new Map(Y.filter((K) => K.type === "prompt").map((K) => [K.prompt, K])).values()),
      X = Array.from(new Map(Y.filter((K) => K.type === "agent").map((K) => [K.prompt([]), K])).values()),
      V = Y.filter((K) => K.type === "callback"),
      F = [...J, ...W, ...X, ...V];
    return g(`Matched ${F.length} unique hooks for query "${I||"no match query"}" (${Y.length} before deduplication)`), F
  } catch {
    return []
  }
}
// @from(Start 13904318, End 13904387)
function LV0(A, Q) {
  return `${A} hook error: ${Q.blockingError}`
}
// @from(Start 13904389, End 13904458)
function MV0(A) {
  return `Stop hook feedback:
${A.blockingError}`
}
// @from(Start 13904460, End 13904553)
function _60(A) {
  return `UserPromptSubmit operation blocked by hook:
${A.blockingError}`
}