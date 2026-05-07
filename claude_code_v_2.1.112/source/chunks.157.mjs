
// @from(Ln 404979, Col 4)
EEK = `
if (-not $EncodedCommand) {
    Write-Output '{"valid":false,"errors":[{"message":"No command provided","errorId":"NoInput"}],"statements":[],"variables":[],"hasStopParsing":false,"originalCommand":""}'
    exit 0
}

$Command = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($EncodedCommand))

$tokens = $null
$parseErrors = $null
$ast = [System.Management.Automation.Language.Parser]::ParseInput(
    $Command,
    [ref]$tokens,
    [ref]$parseErrors
)

$allVariables = [System.Collections.ArrayList]::new()

function Get-RawCommandElements {
    param([System.Management.Automation.Language.CommandAst]$CmdAst)
    $elems = [System.Collections.ArrayList]::new()
    foreach ($ce in $CmdAst.CommandElements) {
        $ceData = @{ type = $ce.GetType().Name; text = $ce.Extent.Text }
        if ($ce.PSObject.Properties['Value'] -and $null -ne $ce.Value -and $ce.Value -is [string]) {
            $ceData.value = $ce.Value
        }
        if ($ce -is [System.Management.Automation.Language.CommandExpressionAst]) {
            $ceData.expressionType = $ce.Expression.GetType().Name
        }
        $a=$ce.Argument;if($a){$ceData.children=@(@{type=$a.GetType().Name;text=$a.Extent.Text})}
        [void]$elems.Add($ceData)
    }
    return $elems
}

function Get-RawRedirections {
    param($Redirections)
    $result = [System.Collections.ArrayList]::new()
    foreach ($redir in $Redirections) {
        $redirData = @{ type = $redir.GetType().Name }
        if ($redir -is [System.Management.Automation.Language.FileRedirectionAst]) {
            $redirData.append = [bool]$redir.Append
            $redirData.fromStream = $redir.FromStream.ToString()
            $redirData.locationText = $redir.Location.Extent.Text
        }
        [void]$result.Add($redirData)
    }
    return $result
}

function Get-SecurityPatterns($A) {
    $p = @{}
    foreach ($n in $A.FindAll({ param($x)
        $x -is [System.Management.Automation.Language.MemberExpressionAst] -or
        $x -is [System.Management.Automation.Language.SubExpressionAst] -or
        $x -is [System.Management.Automation.Language.ArrayExpressionAst] -or
        $x -is [System.Management.Automation.Language.ExpandableStringExpressionAst] -or
        $x -is [System.Management.Automation.Language.ScriptBlockExpressionAst] -or
        $x -is [System.Management.Automation.Language.ParenExpressionAst]
    }, $true)) { switch ($n.GetType().Name) {
        'InvokeMemberExpressionAst' { $p.hasMemberInvocations = $true }
        'MemberExpressionAst' { $p.hasMemberInvocations = $true }
        'SubExpressionAst' { $p.hasSubExpressions = $true }
        'ArrayExpressionAst' { $p.hasSubExpressions = $true }
        'ParenExpressionAst' { $p.hasSubExpressions = $true }
        'ExpandableStringExpressionAst' { $p.hasExpandableStrings = $true }
        'ScriptBlockExpressionAst' { $p.hasScriptBlocks = $true }
    }}
    if ($p.Count -gt 0) { return $p }
    return $null
}

$varExprs = $ast.FindAll({ param($node) $node -is [System.Management.Automation.Language.VariableExpressionAst] }, $true)
foreach ($v in $varExprs) {
    [void]$allVariables.Add(@{
        path = $v.VariablePath.ToString()
        isSplatted = [bool]$v.Splatted
    })
}

$typeLiterals = [System.Collections.ArrayList]::new()
foreach ($t in $ast.FindAll({ param($n)
    $n -is [System.Management.Automation.Language.TypeExpressionAst] -or
    $n -is [System.Management.Automation.Language.TypeConstraintAst]
}, $true)) { [void]$typeLiterals.Add($t.TypeName.FullName) }

$hasStopParsing = $false
$tk = [System.Management.Automation.Language.TokenKind]
foreach ($tok in $tokens) {
    if ($tok.Kind -eq $tk::MinusMinus) { $hasStopParsing = $true; break }
    if ($tok.Kind -eq $tk::Generic -and ($tok.Text -replace '[–—―]','-') -eq '--%') {
        $hasStopParsing = $true; break
    }
}

$statements = [System.Collections.ArrayList]::new()
$script:hasBg = $false
foreach ($p in $ast.FindAll({param($n) $n -is [System.Management.Automation.Language.PipelineBaseAst]}, $true)) {
    if ($p.PSObject.Properties['Background'] -and $p.Background) { $script:hasBg = $true; break }
}

function Process-BlockStatements {
    param($Block)
    if (-not $Block) { return }

    foreach ($stmt in $Block.Statements) {
        $statement = @{
            type = $stmt.GetType().Name
            text = $stmt.Extent.Text
        }

        if ($stmt -is [System.Management.Automation.Language.PipelineAst]) {
            $elements = [System.Collections.ArrayList]::new()
            foreach ($element in $stmt.PipelineElements) {
                $elemData = @{
                    type = $element.GetType().Name
                    text = $element.Extent.Text
                }

                if ($element -is [System.Management.Automation.Language.CommandAst]) {
                    $elemData.commandElements = @(Get-RawCommandElements -CmdAst $element)
                    $elemData.redirections = @(Get-RawRedirections -Redirections $element.Redirections)
                } elseif ($element -is [System.Management.Automation.Language.CommandExpressionAst]) {
                    $elemData.expressionType = $element.Expression.GetType().Name
                    $elemData.redirections = @(Get-RawRedirections -Redirections $element.Redirections)
                }

                [void]$elements.Add($elemData)
            }
            $statement.elements = @($elements)

            $allNestedCmds = $stmt.FindAll(
                { param($node) $node -is [System.Management.Automation.Language.CommandAst] },
                $true
            )
            $nestedCmds = [System.Collections.ArrayList]::new()
            foreach ($cmd in $allNestedCmds) {
                if ($cmd.Parent -eq $stmt) { continue }
                $nested = @{
                    type = $cmd.GetType().Name
                    text = $cmd.Extent.Text
                    commandElements = @(Get-RawCommandElements -CmdAst $cmd)
                    redirections = @(Get-RawRedirections -Redirections $cmd.Redirections)
                }
                [void]$nestedCmds.Add($nested)
            }
            if ($nestedCmds.Count -gt 0) {
                $statement.nestedCommands = @($nestedCmds)
            }
            $r = $stmt.FindAll({param($n) $n -is [System.Management.Automation.Language.FileRedirectionAst]}, $true)
            if ($r.Count -gt 0) {
                $rr = @(Get-RawRedirections -Redirections $r)
                $statement.redirections = if ($statement.redirections) { @($statement.redirections) + $rr } else { $rr }
            }
        } else {
            $nestedCmdAsts = $stmt.FindAll(
                { param($node) $node -is [System.Management.Automation.Language.CommandAst] },
                $true
            )
            $nested = [System.Collections.ArrayList]::new()
            foreach ($cmd in $nestedCmdAsts) {
                [void]$nested.Add(@{
                    type = 'CommandAst'
                    text = $cmd.Extent.Text
                    commandElements = @(Get-RawCommandElements -CmdAst $cmd)
                    redirections = @(Get-RawRedirections -Redirections $cmd.Redirections)
                })
            }
            if ($nested.Count -gt 0) {
                $statement.nestedCommands = @($nested)
            }
            $r = $stmt.FindAll({param($n) $n -is [System.Management.Automation.Language.FileRedirectionAst]}, $true)
            if ($r.Count -gt 0) { $statement.redirections = @(Get-RawRedirections -Redirections $r) }
        }

        $sp = Get-SecurityPatterns $stmt
        if ($sp) { $statement.securityPatterns = $sp }

        [void]$statements.Add($statement)
    }

    if ($Block.Traps) {
        foreach ($trap in $Block.Traps) {
            $statement = @{
                type = 'TrapStatementAst'
                text = $trap.Extent.Text
            }
            $nestedCmdAsts = $trap.FindAll(
                { param($node) $node -is [System.Management.Automation.Language.CommandAst] },
                $true
            )
            $nestedCmds = [System.Collections.ArrayList]::new()
            foreach ($cmd in $nestedCmdAsts) {
                $nested = @{
                    type = $cmd.GetType().Name
                    text = $cmd.Extent.Text
                    commandElements = @(Get-RawCommandElements -CmdAst $cmd)
                    redirections = @(Get-RawRedirections -Redirections $cmd.Redirections)
                }
                [void]$nestedCmds.Add($nested)
            }
            if ($nestedCmds.Count -gt 0) {
                $statement.nestedCommands = @($nestedCmds)
            }
            $r = $trap.FindAll({param($n) $n -is [System.Management.Automation.Language.FileRedirectionAst]}, $true)
            if ($r.Count -gt 0) { $statement.redirections = @(Get-RawRedirections -Redirections $r) }
            $sp = Get-SecurityPatterns $trap
            if ($sp) { $statement.securityPatterns = $sp }
            [void]$statements.Add($statement)
        }
    }
}

Process-BlockStatements -Block $ast.BeginBlock
Process-BlockStatements -Block $ast.ProcessBlock
Process-BlockStatements -Block $ast.EndBlock
Process-BlockStatements -Block $ast.CleanBlock
Process-BlockStatements -Block $ast.DynamicParamBlock

if ($ast.ParamBlock) {
  $pb = $ast.ParamBlock
  $pn = [System.Collections.ArrayList]::new()
  foreach ($c in $pb.FindAll({param($n) $n -is [System.Management.Automation.Language.CommandAst]}, $true)) {
    [void]$pn.Add(@{type='CommandAst';text=$c.Extent.Text;commandElements=@(Get-RawCommandElements -CmdAst $c);redirections=@(Get-RawRedirections -Redirections $c.Redirections)})
  }
  $pr = $pb.FindAll({param($n) $n -is [System.Management.Automation.Language.FileRedirectionAst]}, $true)
  $ps = Get-SecurityPatterns $pb
  if ($pn.Count -gt 0 -or $pr.Count -gt 0 -or $ps) {
    $st = @{type='ParamBlockAst';text=$pb.Extent.Text}
    if ($pn.Count -gt 0) { $st.nestedCommands = @($pn) }
    if ($pr.Count -gt 0) { $st.redirections = @(Get-RawRedirections -Redirections $pr) }
    if ($ps) { $st.securityPatterns = $ps }
    [void]$statements.Add($st)
  }
}

$hasUsingStatements = $ast.UsingStatements -and $ast.UsingStatements.Count -gt 0
$hasScriptRequirements = $ast.ScriptRequirements -ne $null

$output = @{
    valid = ($parseErrors.Count -eq 0)
    errors = @($parseErrors | ForEach-Object {
        @{
            message = $_.Message
            errorId = $_.ErrorId
        }
    })
    statements = @($statements)
    variables = @($allVariables)
    hasStopParsing = $hasStopParsing
    originalCommand = $Command
    typeLiterals = @($typeLiterals)
    hasUsingStatements = [bool]$hasUsingStatements
    hasScriptRequirements = [bool]$hasScriptRequirements
    hasBackgroundJob = [bool]$script:hasBg
}

$output | ConvertTo-Json -Depth 10 -Compress
`
// @from(Ln 405238, Col 4)
cPY = 32767
// @from(Ln 405239, Col 4)
lPY = 200
// @from(Ln 405240, Col 4)
nPY = 21
// @from(Ln 405241, Col 4)
iPY = 100
// @from(Ln 405242, Col 4)
rPY
// @from(Ln 405242, Col 9)
oPY
// @from(Ln 405242, Col 14)
aPY
// @from(Ln 405242, Col 19)
sPY = 4500
// @from(Ln 405243, Col 4)
j_7
// @from(Ln 405243, Col 9)
tPY
// @from(Ln 405243, Col 14)
OWY
// @from(Ln 405243, Col 19)
SI6
// @from(Ln 405243, Col 24)
Hn
// @from(Ln 405243, Col 28)
qg
// @from(Ln 405244, Col 4)
Re = L(() => {
    K8();
    Lm();
    NV();
    Rb6();
    e8();
    rPY = (cPY - lPY) * 3 / 8, oPY = rPY - EEK.length - nPY, aPY = Math.max(0, Math.floor(oPY * 3 / 4) - iPY), j_7 = process.platform === "win32" ? aPY : sPY, tPY = {
        valid: !1,
        statements: [],
        variables: [],
        hasStopParsing: !1
    };
    OWY = new Set(["PwshSpawnError", "PwshError", "PwshTimeout", "EmptyOutput", "InvalidJson"]), SI6 = aX((q) => {
        let K = AWY(q);
        return K.then((_) => {
            if (!_.valid && OWY.has(_.errors[0]?.errorId ?? "")) SI6.cache.delete(q)
        }), K
    }, (q) => q, 256), Hn = Object.assign(Object.create(null), {
        ls: "Get-ChildItem",
        dir: "Get-ChildItem",
        gci: "Get-ChildItem",
        cat: "Get-Content",
        type: "Get-Content",
        gc: "Get-Content",
        cd: "Set-Location",
        sl: "Set-Location",
        chdir: "Set-Location",
        pushd: "Push-Location",
        popd: "Pop-Location",
        pwd: "Get-Location",
        gl: "Get-Location",
        gi: "Get-Item",
        gp: "Get-ItemProperty",
        ni: "New-Item",
        mkdir: "New-Item",
        md: "New-Item",
        ri: "Remove-Item",
        del: "Remove-Item",
        rd: "Remove-Item",
        rmdir: "Remove-Item",
        rm: "Remove-Item",
        erase: "Remove-Item",
        mi: "Move-Item",
        mv: "Move-Item",
        move: "Move-Item",
        ci: "Copy-Item",
        cp: "Copy-Item",
        copy: "Copy-Item",
        cpi: "Copy-Item",
        si: "Set-Item",
        rni: "Rename-Item",
        ren: "Rename-Item",
        ps: "Get-Process",
        gps: "Get-Process",
        kill: "Stop-Process",
        spps: "Stop-Process",
        start: "Start-Process",
        saps: "Start-Process",
        sajb: "Start-Job",
        ipmo: "Import-Module",
        echo: "Write-Output",
        write: "Write-Output",
        sleep: "Start-Sleep",
        help: "Get-Help",
        man: "Get-Help",
        gcm: "Get-Command",
        gsv: "Get-Service",
        gv: "Get-Variable",
        sv: "Set-Variable",
        h: "Get-History",
        history: "Get-History",
        iex: "Invoke-Expression",
        iwr: "Invoke-WebRequest",
        irm: "Invoke-RestMethod",
        icm: "Invoke-Command",
        ii: "Invoke-Item",
        nsn: "New-PSSession",
        etsn: "Enter-PSSession",
        exsn: "Exit-PSSession",
        gsn: "Get-PSSession",
        rsn: "Remove-PSSession",
        cls: "Clear-Host",
        clear: "Clear-Host",
        select: "Select-Object",
        where: "Where-Object",
        foreach: "ForEach-Object",
        "%": "ForEach-Object",
        "?": "Where-Object",
        measure: "Measure-Object",
        ft: "Format-Table",
        fl: "Format-List",
        fw: "Format-Wide",
        oh: "Out-Host",
        ogv: "Out-GridView",
        ac: "Add-Content",
        clc: "Clear-Content",
        tee: "Tee-Object",
        epcsv: "Export-Csv",
        sp: "Set-ItemProperty",
        rp: "Remove-ItemProperty",
        cli: "Clear-Item",
        epal: "Export-Alias",
        sls: "Select-String"
    });
    qg = new Set(["-", "–", "—", "―"])
})
// @from(Ln 405357, Col 0)
function SEK(q) {
    if (!q.startsWith("../")) return q;
    let K = $WY(b8()).toLowerCase();
    if (!K) return q;
    let _ = "../" + K + "/",
        z = q;
    while (z.startsWith(_)) z = z.slice(_.length);
    if (z === "../" + K) return ".";
    return z
}
// @from(Ln 405368, Col 0)
function CEK(q) {
    let K = q;
    if (K.length > 0 && (qg.has(K[0]) || K[0] === "/")) {
        let _ = K.indexOf(":", 1);
        if (_ > 0) K = K.slice(_ + 1)
    }
    if (K = K.replace(/^['"]|['"]$/g, ""), K = K.replaceAll("`", ""), K = K.replace(/^(?:[A-Za-z0-9_.]+\\){0,3}FileSystem::/i, ""), K = K.replace(/^[A-Za-z]:(?![/\\])/, ""), K = K.replaceAll("\\", "/"), K = K.split("/").map((_) => {
            if (_ === "") return _;
            let z;
            do {
                if (z = _, _ = _.replace(/ +$/, ""), _ === "." || _ === "..") return _;
                _ = _.replace(/\.+$/, "")
            } while (_ !== z);
            return _ || "."
        }).join("/"), K = jWY.normalize(K), K.startsWith("./")) K = K.slice(2);
    return K.toLowerCase()
}
// @from(Ln 405386, Col 0)
function bEK(q) {
    let K = b8(),
        _ = HWY(K, q),
        z = K.endsWith(LEK) ? K : K + LEK,
        Y = _.toLowerCase(),
        A = K.toLowerCase(),
        O = z.toLowerCase();
    if (Y === A) return ".";
    if (!Y.startsWith(O)) return null;
    return _.slice(z.length).replaceAll("\\", "/").toLowerCase()
}
// @from(Ln 405398, Col 0)
function hEK(q) {
    if (q === "head" || q === ".git") return !0;
    if (q.startsWith(".git/") || /^git~\d+($|\/)/.test(q)) return !0;
    for (let K of JWY) {
        if (K === "head") continue;
        if (q === K || q.startsWith(K + "/")) return !0
    }
    return !1
}
// @from(Ln 405408, Col 0)
function u38(q) {
    let K = SEK(CEK(q));
    if (hEK(K)) return !0;
    if (K.startsWith("../") || K.startsWith("/") || /^[a-z]:/.test(K)) {
        let _ = bEK(K);
        if (_ !== null && hEK(_)) return !0
    }
    return !1
}
// @from(Ln 405418, Col 0)
function Ic8(q) {
    let K = SEK(CEK(q));
    if (REK(K)) return !0;
    if (K.startsWith("../") || K.startsWith("/") || /^[a-z]:/.test(K)) {
        let _ = bEK(K);
        if (_ !== null && REK(_)) return !0
    }
    return !1
}
// @from(Ln 405428, Col 0)
function REK(q) {
    if (q === ".git" || q.startsWith(".git/")) return !0;
    return /^git~\d+($|\/)/.test(q)
}
// @from(Ln 405432, Col 4)
JWY
// @from(Ln 405433, Col 4)
IEK = L(() => {
    n7();
    Re();
    JWY = ["head", "objects", "refs", "hooks"]
})
// @from(Ln 405439, Col 0)
function BEK(q) {
    if (q.length < 2) return !1;
    return mEK.includes(q) || uEK.some((K) => K.startsWith(q))
}
// @from(Ln 405443, Col 4)
P_7
// @from(Ln 405443, Col 9)
W_7
// @from(Ln 405443, Col 14)
xEK
// @from(Ln 405443, Col 19)
uEK
// @from(Ln 405443, Col 24)
mEK
// @from(Ln 405443, Col 29)
Wj$
// @from(Ln 405443, Col 34)
pEK
// @from(Ln 405444, Col 4)
D_7 = L(() => {
    P_7 = ["-verbose", "-debug"], W_7 = ["-erroraction", "-warningaction", "-informationaction", "-progressaction", "-errorvariable", "-warningvariable", "-informationvariable", "-outvariable", "-outbuffer", "-pipelinevariable", "-ea", "-wa", "-infa", "-proga"], xEK = new Set([...P_7, ...W_7]), uEK = ["-erroraction", "-warningaction", "-informationaction", "-progressaction"], mEK = ["-ea", "-wa", "-infa", "-proga"];
    Wj$ = new Set([...uEK, ...mEK]), pEK = new Set(["silentlycontinue", "0", "stop", "1", "continue", "2", "ignore", "4"])
})
// @from(Ln 405449, Col 0)
function OW(q, K) {
    let _ = (K?.elementTypes ?? []).slice(1),
        z = K?.args ?? [],
        Y = K?.children;
    for (let A = 0; A < _.length; A++) {
        if (_[A] !== "StringConstant" && _[A] !== "Parameter") {
            if (!/[$(@{[]/.test(z[A] ?? "")) continue;
            return !0
        }
        if (_[A] === "Parameter") {
            let O = Y?.[A];
            if (O) {
                if (O.some((w) => w.type !== "StringConstant")) return !0
            } else {
                let w = z[A] ?? "",
                    $ = w.indexOf(":");
                if ($ > 0 && /[$(@{[]/.test(w.slice($ + 1))) return !0
            }
        }
    }
    return !1
}
// @from(Ln 405472, Col 0)
function BY(q) {
    let K = q.toLowerCase();
    if (!K.includes("\\") && !K.includes("/")) K = K.replace(DWY, "");
    let _ = Hn[K];
    if (_) return _.toLowerCase();
    return K
}
// @from(Ln 405480, Col 0)
function m38(q) {
    let K = BY(q);
    return K === "set-location" || K === "push-location" || K === "pop-location" || K === "new-psdrive" || y1() === "windows" && (K === "ndr" || K === "mount")
}
// @from(Ln 405485, Col 0)
function eM6(q) {
    let K = BY(q);
    return MWY.has(K)
}
// @from(Ln 405490, Col 0)
function Z_7(q, K) {
    let _ = BY(q.name);
    if (!PWY.has(_)) return !1;
    return tM6(q, K)
}
// @from(Ln 405496, Col 0)
function f_7(q) {
    if (q.statementType !== "PipelineAst") return !1;
    if (q.commands.length === 0) return !1;
    for (let K of q.commands)
        if (K.elementType !== "CommandAst") return !1;
    return !0
}
// @from(Ln 405504, Col 0)
function ZWY(q) {
    let K = q.toLowerCase(),
        _ = FEK[K];
    if (_) return _;
    let z = BY(K);
    if (z !== K) return FEK[z];
    return
}
// @from(Ln 405513, Col 0)
function gEK(q) {
    let K = q.trim();
    if (!K) return !1;
    if (/\$\(/.test(K)) return !0;
    if (/(?:^|[^\w.])@\w+/.test(K)) return !0;
    if (/\.\w+\s*\(/.test(K)) return !0;
    if (/\$\w+\s*[+\-*/]?=/.test(K)) return !0;
    if (/--%/.test(K)) return !0;
    if (/\\\\/.test(K) || /(?<!:)\/\//.test(K)) return !0;
    if (/::/.test(K)) return !0;
    return !1
}
// @from(Ln 405526, Col 0)
function xc8(q, K) {
    if (!q.trim()) return !1;
    if (!K) return !1;
    if (!K.valid) return !1;
    let z = wL(K);
    if (z.hasScriptBlocks || z.hasSubExpressions || z.hasExpandableStrings || z.hasSplatting || z.hasMemberInvocations || z.hasAssignments || z.hasStopParsing) return !1;
    let Y = Cc8(K);
    if (Y.length === 0) return !1;
    if (Y.reduce((O, w) => O + w.commands.length, 0) > 1) {
        if (Y.some((w) => w.commands.some(($) => m38($.name)))) return !1
    }
    for (let O of Y) {
        if (!O || O.commands.length === 0) return !1;
        if (O.redirections.length > 0) {
            if (O.redirections.some((j) => !j.isMerging && !CI6(j.target))) return !1
        }
        let w = O.commands[0];
        if (!w) return !1;
        if (!tM6(w, q)) return !1;
        for (let $ = 1; $ < O.commands.length; $++) {
            let j = O.commands[$];
            if (!j || j.nameType === "application") return !1;
            if (eM6(j.name) && j.args.length === 0) continue;
            if (!tM6(j, q)) return !1
        }
        if (O.nestedCommands && O.nestedCommands.length > 0) return !1
    }
    return !0
}
// @from(Ln 405556, Col 0)
function fWY(q) {
    for (let K = 0; K < q.length; K++) {
        let _ = q[K];
        if (!qg.has(_[0])) continue;
        let z = _[0] === "-" ? _ : "-" + _.slice(1),
            Y = z.indexOf(":"),
            A = (Y > 0 ? z.slice(0, Y) : z).toLowerCase();
        if (!BEK(A)) continue;
        let w = (Y > 0 ? z.slice(Y + 1) : q[K + 1] ?? "").toLowerCase().replace(/^['"]|['"]$/g, "").trim();
        if (w.length > 0 && !pEK.has(w)) return !0
    }
    return !1
}
// @from(Ln 405570, Col 0)
function tM6(q, K) {
    if (q.nameType === "application") {
        let A = q.text.split(/\s/, 1)[0]?.toLowerCase() ?? "";
        if (!WWY.has(A)) return !1
    }
    let _ = ZWY(q.name);
    if (!_) return !1;
    if (_.regex && !_.regex.test(K)) return !1;
    if (_.additionalCommandIsDangerousCallback?.(K, q)) return !1;
    if (!q.elementTypes) return !1;
    for (let A = 1; A < q.elementTypes.length; A++) {
        let O = q.elementTypes[A];
        if (O !== "StringConstant" && O !== "Parameter") {
            if (!/[$(@{[]/.test(q.args[A - 1] ?? "")) continue;
            return !1
        }
        if (O === "Parameter") {
            let w = q.children?.[A - 1];
            if (w) {
                if (w.some(($) => $.type !== "StringConstant")) return !1
            } else {
                let $ = q.args[A - 1] ?? "",
                    j = $.indexOf(":");
                if (j > 0 && /[$(@{[]/.test($.slice(j + 1))) return !1
            }
        }
    }
    let z = BY(q.name);
    if (y1() === "windows" && (q.nameType === "application" || z === "git" || z === "gh" || z === "docker" || z === "dotnet")) {
        for (let A of q.args)
            if (A.includes('"') && /\s/.test(A)) return !1
    }
    if (z === "git" || z === "gh" || z === "docker" || z === "dotnet") return GWY(z, q.args);
    let Y = z.includes("-");
    if (Y && fWY(q.args)) return !1;
    if (_.allowAllFlags) return !0;
    if (!_.safeFlags || _.safeFlags.length === 0) return !q.args.some((O, w) => {
        if (Y) return W_6(O, q.elementTypes?.[w + 1]);
        return O.startsWith("-") || process.platform === "win32" && O.startsWith("/")
    });
    for (let A = 0; A < q.args.length; A++) {
        let O = q.args[A];
        if (Y ? W_6(O, q.elementTypes?.[A + 1]) : O.startsWith("-") || process.platform === "win32" && O.startsWith("/")) {
            let $ = Y ? "-" + O.slice(1) : O;
            if (Y || O.startsWith("/")) {
                let J = $.indexOf(":");
                if (J > 0) $ = $.substring(0, J)
            }
            let j = $.toLowerCase();
            if (Y && xEK.has(j)) continue;
            if (!(Y ? _.safeFlags.some((J) => J.toLowerCase() === j) : _.safeFlags.includes($))) return !1
        }
    }
    return !0
}
// @from(Ln 405626, Col 0)
function GWY(q, K) {
    switch (q) {
        case "git":
            return kWY(K);
        case "gh":
            return NWY(K);
        case "docker":
            return EWY(K);
        case "dotnet":
            return yWY(K);
        default:
            return !1
    }
}
// @from(Ln 405641, Col 0)
function kWY(q) {
    if (q.length === 0) return !0;
    for (let j of q)
        if (j.includes("$")) return !1;
    let K = 0;
    while (K < q.length) {
        let j = q[K];
        if (!j || !j.startsWith("-")) break;
        for (let X of VWY)
            if (j.length > X.length && j.startsWith(X) && (X === "-C" || j[X.length] !== "-")) return !1;
        let H = j.includes("="),
            J = H ? j.split("=")[0] || "" : j;
        if (vWY.has(J)) return !1;
        if (!H && TWY.has(J)) K += 2;
        else K++
    }
    if (K >= q.length) return !0;
    let _ = q[K]?.toLowerCase() || "",
        z = K + 1 < q.length ? q[K + 1]?.toLowerCase() || "" : "",
        Y = `git ${_} ${z}`,
        A = `git ${_}`,
        O = nt6[Y],
        w = 2;
    if (!O) O = nt6[A], w = 1;
    if (!O) return !1;
    let $ = q.slice(K + w);
    if (_ === "ls-remote") {
        for (let j of $)
            if (!j.startsWith("-")) {
                if (j.includes("://") || j.includes("@") || j.includes(":") || j.includes("$")) return !1
            }
    }
    if (O.additionalCommandIsDangerousCallback && O.additionalCommandIsDangerousCallback("", $)) return !1;
    return Dy6($, 0, O, {
        commandName: "git"
    })
}
// @from(Ln 405679, Col 0)
function NWY(q) {
    return !1
}
// @from(Ln 405683, Col 0)
function EWY(q) {
    if (q.length === 0) return !0;
    for (let Y of q)
        if (Y.includes("$")) return !1;
    for (let Y of q) {
        if (Y[0] === "-" && Y[1] !== "-")
            for (let O = 1; O < Y.length; O++) {
                if (Y[O] === "H") return !1;
                if (Y[O]?.toLowerCase() === "c") return !1
            }
        let A = Y.toLowerCase();
        if (A.startsWith("--host") || A.startsWith("--context") || A.startsWith("--config") || A.startsWith("--tls")) return !1
    }
    let K = `docker ${q[0]?.toLowerCase()}`;
    if (eh8.includes(K)) return !0;
    let _ = th8[K];
    if (!_) return !1;
    let z = q.slice(1);
    if (_.additionalCommandIsDangerousCallback && _.additionalCommandIsDangerousCallback("", z)) return !1;
    return Dy6(z, 0, _)
}
// @from(Ln 405705, Col 0)
function yWY(q) {
    if (q.length === 0) return !1;
    for (let K of q)
        if (!XWY.has(K.toLowerCase())) return !1;
    return !0
}
// @from(Ln 405711, Col 4)
XWY
// @from(Ln 405711, Col 9)
FEK
// @from(Ln 405711, Col 14)
MWY
// @from(Ln 405711, Col 19)
PWY
// @from(Ln 405711, Col 24)
WWY
// @from(Ln 405711, Col 29)
DWY
// @from(Ln 405711, Col 34)
vWY
// @from(Ln 405711, Col 39)
TWY
// @from(Ln 405711, Col 44)
VWY
// @from(Ln 405712, Col 4)
bI6 = L(() => {
    NK();
    Re();
    Zy6();
    D_7();
    XWY = new Set(["--version", "--info", "--list-runtimes", "--list-sdks"]);
    FEK = Object.assign(Object.create(null), {
        "get-childitem": {
            safeFlags: ["-Path", "-LiteralPath", "-Filter", "-Include", "-Exclude", "-Recurse", "-Depth", "-Name", "-Force", "-Attributes", "-Directory", "-File", "-Hidden", "-ReadOnly", "-System"]
        },
        "get-content": {
            safeFlags: ["-Path", "-LiteralPath", "-TotalCount", "-Head", "-Tail", "-Raw", "-Encoding", "-Delimiter", "-ReadCount"]
        },
        "get-item": {
            safeFlags: ["-Path", "-LiteralPath", "-Force", "-Stream"]
        },
        "get-itemproperty": {
            safeFlags: ["-Path", "-LiteralPath", "-Name"]
        },
        "test-path": {
            safeFlags: ["-Path", "-LiteralPath", "-PathType", "-Filter", "-Include", "-Exclude", "-IsValid", "-NewerThan", "-OlderThan"]
        },
        "resolve-path": {
            safeFlags: ["-Path", "-LiteralPath", "-Relative"]
        },
        "get-filehash": {
            safeFlags: ["-Path", "-LiteralPath", "-Algorithm", "-InputStream"]
        },
        "get-acl": {
            safeFlags: ["-Path", "-LiteralPath", "-Audit", "-Filter", "-Include", "-Exclude"]
        },
        "set-location": {
            safeFlags: ["-Path", "-LiteralPath", "-PassThru", "-StackName"]
        },
        "push-location": {
            safeFlags: ["-Path", "-LiteralPath", "-PassThru", "-StackName"]
        },
        "pop-location": {
            safeFlags: ["-PassThru", "-StackName"]
        },
        "select-string": {
            safeFlags: ["-Path", "-LiteralPath", "-Pattern", "-InputObject", "-SimpleMatch", "-CaseSensitive", "-Quiet", "-List", "-NotMatch", "-AllMatches", "-Encoding", "-Context", "-Raw", "-NoEmphasis"]
        },
        "convertto-json": {
            safeFlags: ["-InputObject", "-Depth", "-Compress", "-EnumsAsStrings", "-AsArray"]
        },
        "convertfrom-json": {
            safeFlags: ["-InputObject", "-Depth", "-AsHashtable", "-NoEnumerate"]
        },
        "convertto-csv": {
            safeFlags: ["-InputObject", "-Delimiter", "-NoTypeInformation", "-NoHeader", "-UseQuotes"]
        },
        "convertfrom-csv": {
            safeFlags: ["-InputObject", "-Delimiter", "-Header", "-UseCulture"]
        },
        "convertto-xml": {
            safeFlags: ["-InputObject", "-Depth", "-As", "-NoTypeInformation"]
        },
        "convertto-html": {
            safeFlags: ["-InputObject", "-Property", "-Head", "-Title", "-Body", "-Pre", "-Post", "-As", "-Fragment"]
        },
        "format-hex": {
            safeFlags: ["-Path", "-LiteralPath", "-InputObject", "-Encoding", "-Count", "-Offset"]
        },
        "get-member": {
            safeFlags: ["-InputObject", "-MemberType", "-Name", "-Static", "-View", "-Force"]
        },
        "get-unique": {
            safeFlags: ["-InputObject", "-AsString", "-CaseInsensitive", "-OnType"]
        },
        "compare-object": {
            safeFlags: ["-ReferenceObject", "-DifferenceObject", "-Property", "-SyncWindow", "-CaseSensitive", "-Culture", "-ExcludeDifferent", "-IncludeEqual", "-PassThru"]
        },
        "join-string": {
            safeFlags: ["-InputObject", "-Property", "-Separator", "-OutputPrefix", "-OutputSuffix", "-SingleQuote", "-DoubleQuote", "-FormatString"]
        },
        "get-random": {
            safeFlags: ["-InputObject", "-Minimum", "-Maximum", "-Count", "-SetSeed", "-Shuffle"]
        },
        "convert-path": {
            safeFlags: ["-Path", "-LiteralPath"]
        },
        "join-path": {
            safeFlags: ["-Path", "-ChildPath", "-AdditionalChildPath"]
        },
        "split-path": {
            safeFlags: ["-Path", "-LiteralPath", "-Qualifier", "-NoQualifier", "-Parent", "-Leaf", "-LeafBase", "-Extension", "-IsAbsolute"]
        },
        "get-hotfix": {
            safeFlags: ["-Id", "-Description"]
        },
        "get-itempropertyvalue": {
            safeFlags: ["-Path", "-LiteralPath", "-Name"]
        },
        "get-psprovider": {
            safeFlags: ["-PSProvider"]
        },
        "get-process": {
            safeFlags: ["-Name", "-Id", "-Module", "-FileVersionInfo", "-IncludeUserName"]
        },
        "get-service": {
            safeFlags: ["-Name", "-DisplayName", "-DependentServices", "-RequiredServices", "-Include", "-Exclude"]
        },
        "get-computerinfo": {
            allowAllFlags: !0
        },
        "get-host": {
            allowAllFlags: !0
        },
        "get-date": {
            safeFlags: ["-Date", "-Format", "-UFormat", "-DisplayHint", "-AsUTC"]
        },
        "get-location": {
            safeFlags: ["-PSProvider", "-PSDrive", "-Stack", "-StackName"]
        },
        "get-psdrive": {
            safeFlags: ["-Name", "-PSProvider", "-Scope"]
        },
        "get-module": {
            safeFlags: ["-Name", "-ListAvailable", "-All", "-FullyQualifiedName", "-PSEdition"]
        },
        "get-alias": {
            safeFlags: ["-Name", "-Definition", "-Scope", "-Exclude"]
        },
        "get-history": {
            safeFlags: ["-Id", "-Count"]
        },
        "get-culture": {
            allowAllFlags: !0
        },
        "get-uiculture": {
            allowAllFlags: !0
        },
        "get-timezone": {
            safeFlags: ["-Name", "-Id", "-ListAvailable"]
        },
        "get-uptime": {
            allowAllFlags: !0
        },
        "write-output": {
            safeFlags: ["-InputObject", "-NoEnumerate"],
            additionalCommandIsDangerousCallback: OW
        },
        "write-host": {
            safeFlags: ["-Object", "-NoNewline", "-Separator", "-ForegroundColor", "-BackgroundColor"],
            additionalCommandIsDangerousCallback: OW
        },
        "start-sleep": {
            safeFlags: ["-Seconds", "-Milliseconds", "-Duration"],
            additionalCommandIsDangerousCallback: OW
        },
        "format-table": {
            allowAllFlags: !0,
            additionalCommandIsDangerousCallback: OW
        },
        "format-list": {
            allowAllFlags: !0,
            additionalCommandIsDangerousCallback: OW
        },
        "format-wide": {
            allowAllFlags: !0,
            additionalCommandIsDangerousCallback: OW
        },
        "format-custom": {
            allowAllFlags: !0,
            additionalCommandIsDangerousCallback: OW
        },
        "measure-object": {
            allowAllFlags: !0,
            additionalCommandIsDangerousCallback: OW
        },
        "select-object": {
            allowAllFlags: !0,
            additionalCommandIsDangerousCallback: OW
        },
        "sort-object": {
            allowAllFlags: !0,
            additionalCommandIsDangerousCallback: OW
        },
        "group-object": {
            allowAllFlags: !0,
            additionalCommandIsDangerousCallback: OW
        },
        "where-object": {
            allowAllFlags: !0,
            additionalCommandIsDangerousCallback: OW
        },
        "out-string": {
            allowAllFlags: !0,
            additionalCommandIsDangerousCallback: OW
        },
        "out-host": {
            allowAllFlags: !0,
            additionalCommandIsDangerousCallback: OW
        },
        "get-netadapter": {
            safeFlags: ["-Name", "-InterfaceDescription", "-InterfaceIndex", "-Physical"]
        },
        "get-netipaddress": {
            safeFlags: ["-InterfaceIndex", "-InterfaceAlias", "-AddressFamily", "-Type"]
        },
        "get-netipconfiguration": {
            safeFlags: ["-InterfaceIndex", "-InterfaceAlias", "-Detailed", "-All"]
        },
        "get-netroute": {
            safeFlags: ["-InterfaceIndex", "-InterfaceAlias", "-AddressFamily", "-DestinationPrefix"]
        },
        "get-dnsclient": {
            safeFlags: ["-InterfaceIndex", "-InterfaceAlias"]
        },
        "get-eventlog": {
            safeFlags: ["-LogName", "-Newest", "-After", "-Before", "-EntryType", "-Index", "-InstanceId", "-Message", "-Source", "-UserName", "-AsBaseObject", "-List"]
        },
        "get-winevent": {
            safeFlags: ["-LogName", "-ListLog", "-ListProvider", "-ProviderName", "-Path", "-MaxEvents", "-FilterXPath", "-Force", "-Oldest"]
        },
        "get-cimclass": {
            safeFlags: ["-ClassName", "-Namespace", "-MethodName", "-PropertyName", "-QualifierName"]
        },
        git: {},
        gh: {},
        docker: {},
        ipconfig: {
            safeFlags: ["/all", "/allcompartments"],
            additionalCommandIsDangerousCallback: (q, K) => {
                return (K?.args ?? []).some((_) => !_.startsWith("/") && !_.startsWith("-"))
            }
        },
        netstat: {
            safeFlags: ["-a", "-b", "-e", "-f", "-n", "-o", "-p", "-q", "-r", "-s", "-t", "-x", "-y"]
        },
        systeminfo: {
            safeFlags: ["/FO", "/NH"]
        },
        tasklist: {
            safeFlags: ["/M", "/SVC", "/V", "/FI", "/FO", "/NH"]
        },
        "where.exe": {
            allowAllFlags: !0
        },
        hostname: {
            safeFlags: ["-a", "-d", "-f", "-i", "-I", "-s", "-y", "-A"],
            additionalCommandIsDangerousCallback: (q, K) => {
                return (K?.args ?? []).some((_) => !_.startsWith("-"))
            }
        },
        whoami: {
            safeFlags: ["/user", "/groups", "/claims", "/priv", "/logonid", "/all", "/fo", "/nh"]
        },
        ver: {
            allowAllFlags: !0
        },
        arp: {
            safeFlags: ["-a", "-g", "-v", "-n"],
            additionalCommandIsDangerousCallback: (q, K) => {
                return (K?.args ?? []).some((_) => !_.startsWith("-"))
            }
        },
        route: {
            safeFlags: ["print", "PRINT", "-4", "-6"],
            additionalCommandIsDangerousCallback: (q, K) => {
                if (!K) return !0;
                return K.args.find((z) => !z.startsWith("-"))?.toLowerCase() !== "print"
            }
        },
        getmac: {
            safeFlags: ["/FO", "/NH", "/V"]
        },
        file: {
            safeFlags: ["-b", "--brief", "-i", "--mime", "-L", "--dereference", "--mime-type", "--mime-encoding", "-z", "--uncompress", "-p", "--preserve-date", "-k", "--keep-going", "-r", "--raw", "-v", "--version", "-0", "--print0", "-s", "--special-files", "-l", "-F", "--separator", "-e", "-P", "-N", "--no-pad", "-E", "--extension"]
        },
        tree: {
            safeFlags: ["/F", "/A", "/Q", "/L"]
        },
        findstr: {
            safeFlags: ["/B", "/E", "/L", "/R", "/S", "/I", "/X", "/V", "/N", "/M", "/O", "/P", "/C", "/G", "/D", "/A"]
        },
        dotnet: {}
    }), MWY = new Set(["out-null"]), PWY = new Set(["format-table", "format-list", "format-wide", "format-custom", "measure-object", "select-object", "sort-object", "group-object", "where-object", "out-string", "out-host"]), WWY = new Set(["where.exe"]), DWY = /\.(exe|cmd|bat|com)$/;
    vWY = new Set(["-c", "-C", "--exec-path", "--config-env", "--git-dir", "--work-tree", "--attr-source"]), TWY = new Set(["-c", "-C", "--exec-path", "--config-env", "--git-dir", "--work-tree", "--namespace", "--super-prefix", "--shallow-file"]), VWY = ["-c", "-C"]
})
// @from(Ln 405994, Col 0)
function G_7(q) {
    let K = BY(q);
    return LWY.has(K)
}
// @from(Ln 405999, Col 0)
function RWY(q) {
    return q.length >= 3 && "-itemtype".startsWith(q) || q.length >= 3 && "-type".startsWith(q)
}
// @from(Ln 406003, Col 0)
function v_7(q) {
    if (BY(q.name) !== "new-item") return !1;
    for (let _ = 0; _ < q.args.length; _++) {
        let z = q.args[_] ?? "";
        if (z.length === 0) continue;
        let A = (qg.has(z[0]) || z[0] === "/" ? "-" + z.slice(1) : z).toLowerCase(),
            O = A.indexOf(":", 1),
            $ = (O > 0 ? A.slice(0, O) : A).replace(/`/g, "");
        if (!RWY($)) continue;
        let H = (O > 0 ? A.slice(O + 1) : q.args[_ + 1]?.toLowerCase() ?? "").replace(/`/g, "").replace(/^['"]|['"]$/g, "");
        if (hWY.has(H)) return !0
    }
    return !1
}
// @from(Ln 406018, Col 0)
function T_7(q, K, _) {
    if (_.mode === "bypassPermissions" || _.mode === "dontAsk") return {
        behavior: "passthrough",
        message: "Mode is handled in main permission flow"
    };
    if (_.mode !== "acceptEdits") return {
        behavior: "passthrough",
        message: "No mode-specific validation required"
    };
    if (!K.valid) return {
        behavior: "passthrough",
        message: "Cannot validate mode for unparsed command"
    };
    let z = wL(K);
    if (z.hasSubExpressions || z.hasScriptBlocks || z.hasMemberInvocations || z.hasSplatting || z.hasAssignments || z.hasStopParsing || z.hasExpandableStrings) return {
        behavior: "passthrough",
        message: "Command contains subexpressions, script blocks, or member invocations that require approval"
    };
    let Y = Cc8(K);
    if (Y.length === 0) return {
        behavior: "passthrough",
        message: "No commands found to validate for acceptEdits mode"
    };
    if (Y.reduce((O, w) => O + w.commands.length, 0) > 1) {
        let O = !1,
            w = !1,
            $ = !1;
        for (let j of Y)
            for (let H of j.commands) {
                if (H.elementType !== "CommandAst") continue;
                if (m38(H.name)) O = !0;
                if (v_7(H)) w = !0;
                if (G_7(H.name)) $ = !0
            }
        if (O && $) return {
            behavior: "passthrough",
            message: "Compound command contains a directory-changing command (Set-Location/Push-Location/Pop-Location) with a write operation — cannot auto-allow because path validation uses stale cwd"
        };
        if (w) return {
            behavior: "passthrough",
            message: "Compound command creates a filesystem link (New-Item -ItemType SymbolicLink/Junction/HardLink) — cannot auto-allow because path validation cannot follow just-created links"
        }
    }
    for (let O of Y) {
        for (let w of O.commands) {
            if (w.elementType !== "CommandAst") return {
                behavior: "passthrough",
                message: `Pipeline contains expression source (${w.elementType}) that cannot be statically validated`
            };
            if (w.nameType === "application") return {
                behavior: "passthrough",
                message: `Command '${w.name}' resolved from a path-like name and requires approval`
            };
            if (w.elementTypes)
                for (let $ = 1; $ < w.elementTypes.length; $++) {
                    let j = w.elementTypes[$];
                    if (j !== "StringConstant" && j !== "Parameter") return {
                        behavior: "passthrough",
                        message: `Command argument has unvalidatable type (${j}) — variable paths cannot be statically resolved`
                    };
                    if (j === "Parameter") {
                        let H = w.args[$ - 1] ?? "",
                            J = H.indexOf(":");
                        if (J > 0 && /[$(@{[]/.test(H.slice(J + 1))) return {
                            behavior: "passthrough",
                            message: "Colon-bound parameter contains an expression that cannot be statically validated"
                        }
                    }
                }
            if (eM6(w.name) || Z_7(w, q.command)) continue;
            if (!G_7(w.name)) return {
                behavior: "passthrough",
                message: `No mode-specific handling for '${w.name}' in acceptEdits mode`
            };
            if (OW(w.name, w)) return {
                behavior: "passthrough",
                message: `Arguments in '${w.name}' cannot be statically validated in acceptEdits mode`
            }
        }
        if (O.nestedCommands)
            for (let w of O.nestedCommands) {
                if (w.elementType !== "CommandAst") return {
                    behavior: "passthrough",
                    message: `Nested expression element (${w.elementType}) cannot be statically validated`
                };
                if (w.nameType === "application") return {
                    behavior: "passthrough",
                    message: `Nested command '${w.name}' resolved from a path-like name and requires approval`
                };
                if (eM6(w.name) || Z_7(w, q.command)) continue;
                if (!G_7(w.name)) return {
                    behavior: "passthrough",
                    message: `No mode-specific handling for '${w.name}' in acceptEdits mode`
                };
                if (OW(w.name, w)) return {
                    behavior: "passthrough",
                    message: `Arguments in nested '${w.name}' cannot be statically validated in acceptEdits mode`
                }
            }
    }
    return {
        behavior: "allow",
        updatedInput: q,
        decisionReason: {
            type: "mode",
            mode: "acceptEdits"
        }
    }
}
// @from(Ln 406127, Col 4)
LWY
// @from(Ln 406127, Col 9)
hWY
// @from(Ln 406128, Col 4)
UEK = L(() => {
    Re();
    bI6();
    LWY = new Set(["set-content", "add-content", "remove-item", "clear-content"]);
    hWY = new Set(["symboliclink", "junction", "hardlink"])
})
// @from(Ln 406142, Col 0)
function uc8(q, K) {
    for (let _ of K)
        if (_ === q || q.length > 1 && _.startsWith(q)) return !0;
    return !1
}
// @from(Ln 406148, Col 0)
function mc8(q) {
    return q.includes(",") || q.startsWith("(") || q.startsWith("[") || q.includes("`") || q.includes("@(") || q.startsWith("@{") || q.includes("$")
}
// @from(Ln 406152, Col 0)
function Bc8(q) {
    let K = q.length;
    if (K <= V_7) return q.map((z) => `'${z}'`).join(", ");
    return `${q.slice(0,V_7).map((z)=>`'${z}'`).join(", ")}, and ${K-V_7} more`
}
// @from(Ln 406158, Col 0)
function E_7(q) {
    if (q === "~" || q.startsWith("~/") || q.startsWith("~\\")) return SWY() + q.slice(1);
    return q
}
// @from(Ln 406163, Col 0)
function Fc8(q) {
    let K = E_7(q.replace(/^['"]|['"]$/g, "")).replace(/\\/g, "/");
    return fy6(K)
}
// @from(Ln 406168, Col 0)
function II6(q) {
    return {
        behavior: "deny",
        message: `Remove-Item on system path '${q}' is blocked. This path is protected from removal.`,
        decisionReason: {
            type: "other",
            reason: "Removal targets a protected system path"
        }
    }
}
// @from(Ln 406179, Col 0)
function QEK(q, K, _, z) {
    let Y = _ === "read" ? "read" : "edit",
        A = ZJ(q, K, Y, "deny");
    if (A !== null) return {
        allowed: !1,
        decisionReason: {
            type: "rule",
            rule: A
        }
    };
    if (_ !== "read") {
        let $ = at6(q, {});
        if ($.behavior === "allow") return {
            allowed: !0,
            decisionReason: $.decisionReason
        }
    }
    if (_ !== "read") {
        let $ = ot6(q, z, void 0, K.isRemoteMode);
        if (!$.safe) return {
            allowed: !1,
            decisionReason: {
                type: "safetyCheck",
                reason: $.message,
                classifierApprovable: $.classifierApprovable
            }
        }
    }
    let O = Tk(q, K, z);
    if (O) {
        if (_ === "read" || K.mode === "acceptEdits") return {
            allowed: !0
        }
    }
    if (_ === "read") {
        let $ = st6(q, {});
        if ($.behavior === "allow") return {
            allowed: !0,
            decisionReason: $.decisionReason
        }
    }
    if (_ !== "read" && !O && vg1(q)) return {
        allowed: !0,
        decisionReason: {
            type: "other",
            reason: "Path is in sandbox write allowlist"
        }
    };
    let w = ZJ(q, K, Y, "allow");
    if (w !== null) return {
        allowed: !0,
        decisionReason: {
            type: "rule",
            rule: w
        }
    };
    return {
        allowed: !1
    }
}
// @from(Ln 406240, Col 0)
function N_7(q, K, _, z) {
    if (!q || q.includes("\x00")) return null;
    let Y = E_7(q),
        A = B38(Y) ? Y : xI6(K, Y),
        {
            resolvedPath: O
        } = vA(V8(), A),
        $ = ZJ(O, _, z === "read" ? "read" : "edit", "deny");
    return $ ? {
        resolvedPath: O,
        rule: $
    } : null
}
// @from(Ln 406254, Col 0)
function pc8(q, K, _, z) {
    let A = E_7(q.replace(/^['"]|['"]$/g, "")).replaceAll("\\", "/");
    if (/^~[^/]/.test(A)) return {
        allowed: !1,
        resolvedPath: A,
        decisionReason: {
            type: "other",
            reason: "Paths beginning with ~user cannot be statically validated and require manual approval"
        }
    };
    if (A.includes("`")) {
        let J = A.replaceAll("`", ""),
            X = N_7(J, K, _, z);
        if (X) return {
            allowed: !1,
            resolvedPath: X.resolvedPath,
            decisionReason: {
                type: "rule",
                rule: X.rule
            }
        };
        return {
            allowed: !1,
            resolvedPath: A,
            decisionReason: {
                type: "other",
                reason: "Backtick escape characters in paths cannot be statically validated and require manual approval"
            }
        }
    }
    if (A.includes("::")) {
        let J = A.slice(A.indexOf("::") + 2),
            X = N_7(J, K, _, z);
        if (X) return {
            allowed: !1,
            resolvedPath: X.resolvedPath,
            decisionReason: {
                type: "rule",
                rule: X.rule
            }
        };
        return {
            allowed: !1,
            resolvedPath: A,
            decisionReason: {
                type: "other",
                reason: "Module-qualified provider paths (::) cannot be statically validated and require manual approval"
            }
        }
    }
    if (A.startsWith("//") || /DavWWWRoot/i.test(A) || /@SSL@/i.test(A)) return {
        allowed: !1,
        resolvedPath: A,
        decisionReason: {
            type: "other",
            reason: "UNC paths are blocked because they can trigger network requests and credential leakage"
        }
    };
    if (A.includes("$") || A.includes("%")) return {
        allowed: !1,
        resolvedPath: A,
        decisionReason: {
            type: "other",
            reason: "Variable expansion syntax in paths requires manual approval"
        }
    };
    if ((y1() === "windows" ? /^[a-z0-9]{2,}:/i : /^[a-z0-9]+:/i).test(A)) return {
        allowed: !1,
        resolvedPath: A,
        decisionReason: {
            type: "other",
            reason: `Path '${A}' uses a non-filesystem provider and requires manual approval`
        }
    };
    if (cEK.test(A)) {
        if (z === "write" || z === "create") return {
            allowed: !1,
            resolvedPath: A,
            decisionReason: {
                type: "other",
                reason: "Glob patterns are not allowed in write operations. Please specify an exact file path."
            }
        };
        if (MU(A)) {
            let D = B38(A) ? A : xI6(K, A),
                {
                    resolvedPath: Z,
                    isCanonical: G
                } = vA(V8(), D),
                f = QEK(Z, _, z, G ? [Z] : void 0);
            return {
                allowed: f.allowed,
                resolvedPath: Z,
                decisionReason: f.decisionReason
            }
        }
        let J = CWY(A),
            X = B38(J) ? J : xI6(K, J),
            {
                resolvedPath: M
            } = vA(V8(), X),
            W = ZJ(M, _, z === "read" ? "read" : "edit", "deny");
        if (W !== null) return {
            allowed: !1,
            resolvedPath: M,
            decisionReason: {
                type: "rule",
                rule: W
            }
        };
        return {
            allowed: !1,
            resolvedPath: M,
            decisionReason: {
                type: "other",
                reason: "Glob patterns in paths cannot be statically validated — symlinks inside the glob expansion are not examined. Requires manual approval."
            }
        }
    }
    let w = B38(A) ? A : xI6(K, A),
        {
            resolvedPath: $,
            isCanonical: j
        } = vA(V8(), w),
        H = QEK($, _, z, j ? [$] : void 0);
    return {
        allowed: H.allowed,
        resolvedPath: $,
        decisionReason: H.decisionReason
    }
}
// @from(Ln 406386, Col 0)
function CWY(q) {
    let K = q.match(cEK);
    if (!K || K.index === void 0) return q;
    let _ = q.substring(0, K.index),
        z = Math.max(_.lastIndexOf("/"), _.lastIndexOf("\\"));
    if (z === -1) return ".";
    return _.substring(0, z + 1) || "/"
}
// @from(Ln 406395, Col 0)
function dEK(q) {
    let K = BY(q.name),
        _ = k_7[K];
    if (!_) return {
        paths: [],
        operationType: "read",
        hasUnvalidatablePathArg: !1,
        optionalWrite: !1
    };
    let z = [..._.knownSwitches, ...P_7],
        Y = [..._.knownValueParams, ...W_7],
        A = [],
        O = q.args,
        w = q.elementTypes,
        $ = !1,
        j = 0,
        H = _.positionalSkip ?? 0;

    function J(X) {
        if (!w) return;
        let M = w[X + 1];
        if (M && !bWY.has(M)) $ = !0
    }
    for (let X = 0; X < O.length; X++) {
        let M = O[X];
        if (!M) continue;
        let P = w ? w[X + 1] : void 0;
        if (W_6(M, P)) {
            let W = "-" + M.slice(1),
                D = W.indexOf(":", 1),
                G = (D > 0 ? W.substring(0, D) : W).toLowerCase();
            if (uc8(G, _.pathParams)) {
                let f;
                if (D > 0) {
                    let v = M.substring(D + 1);
                    if (mc8(v)) $ = !0;
                    else f = v
                } else {
                    let v = O[X + 1],
                        V = w ? w[X + 2] : void 0;
                    if (v && !W_6(v, V)) f = v, J(X + 1), X++
                }
                if (f) A.push(f)
            } else if (_.leafOnlyPathParams && uc8(G, _.leafOnlyPathParams)) {
                let f;
                if (D > 0) {
                    let v = M.substring(D + 1);
                    if (mc8(v)) $ = !0;
                    else f = v
                } else {
                    let v = O[X + 1],
                        V = w ? w[X + 2] : void 0;
                    if (v && !W_6(v, V)) f = v, J(X + 1), X++
                }
                if (f !== void 0)
                    if (f.includes("/") || f.includes("\\") || f === "." || f === "..") $ = !0;
                    else A.push(f)
            } else if (uc8(G, z));
            else if (uc8(G, Y))
                if (D > 0) {
                    let f = M.substring(D + 1);
                    if (mc8(f)) $ = !0
                } else {
                    let f = O[X + 1],
                        v = w ? w[X + 2] : void 0;
                    if (f && !W_6(f, v)) J(X + 1), X++
                }
            else if ($ = !0, D > 0) {
                let f = M.substring(D + 1);
                if (!mc8(f)) A.push(f)
            }
            continue
        }
        if (j < H) {
            j++;
            continue
        }
        j++, J(X), A.push(M)
    }
    return {
        paths: A,
        operationType: _.operationType,
        hasUnvalidatablePathArg: $,
        optionalWrite: _.optionalWrite ?? !1
    }
}
// @from(Ln 406482, Col 0)
function lEK(q, K, _, z = !1) {
    if (!K.valid) return {
        behavior: "passthrough",
        message: "Cannot validate paths for unparsed command"
    };
    let Y;
    for (let A of K.statements) {
        let O = IWY(A, _, z);
        if (O.behavior === "deny") return O;
        if (O.behavior === "ask" && !Y) Y = O
    }
    return Y ?? {
        behavior: "passthrough",
        message: "All path constraints validated successfully"
    }
}
// @from(Ln 406499, Col 0)
function IWY(q, K, _ = !1) {
    let z = b8(),
        Y;
    if (_) Y = {
        behavior: "ask",
        message: "Compound command changes working directory (Set-Location/Push-Location/Pop-Location/New-PSDrive) — relative paths cannot be validated against the original cwd and require manual approval",
        decisionReason: {
            type: "other",
            reason: "Compound command contains cd with path operation — manual approval required to prevent path resolution bypass"
        }
    };
    let A = !1,
        O;
    for (let w of q.commands) {
        if (w.elementType !== "CommandAst") {
            A = !0, O = w.text;
            continue
        }
        let {
            paths: $,
            operationType: j,
            hasUnvalidatablePathArg: H,
            optionalWrite: J
        } = dEK(w);
        if (A) {
            let M = BY(w.name);
            if (O !== void 0) {
                let P = O.replace(/^['"]|['"]$/g, ""),
                    W = N_7(P, z, K, j);
                if (W) return {
                    behavior: "deny",
                    message: `${M} targeting '${W.resolvedPath}' was blocked by a deny rule`,
                    decisionReason: {
                        type: "rule",
                        rule: W.rule
                    }
                }
            }
            Y ??= {
                behavior: "ask",
                message: `${M} receives its path from a pipeline expression source that cannot be statically validated and requires manual approval`
            }
        }
        if (H) {
            let M = BY(w.name);
            Y ??= {
                behavior: "ask",
                message: `${M} uses a parameter or complex path expression (array literal, subexpression, unknown parameter, etc.) that cannot be statically validated and requires manual approval`
            }
        }
        if (j !== "read" && !J && $.length === 0 && k_7[BY(w.name)]) {
            let M = BY(w.name);
            Y ??= {
                behavior: "ask",
                message: `${M} is a write operation but no target path could be determined; requires manual approval`
            };
            continue
        }
        let X = BY(w.name) === "remove-item";
        if (X) {
            if (w.args.some((P) => {
                    let W = (P.length > 0 ? "-" + P.slice(1) : P).toLowerCase(),
                        D = W.indexOf(":"),
                        Z = D > 0 ? W.slice(0, D) : W;
                    return Z.length >= 2 && "-recurse".startsWith(Z)
                })) {
                let P = pM(z);
                for (let W of $) {
                    let D = B38(W) ? xI6(W) : xI6(z, W),
                        Z = pM(D);
                    if (Z === P || P.startsWith(Z + "/") || P.startsWith(Z + "\\")) {
                        Y ??= {
                            behavior: "ask",
                            message: `Remove-Item -Recurse targeting '${W}' would delete the working directory including .git and .claude — requires manual approval`
                        };
                        break
                    }
                }
            }
        }
        for (let M of $) {
            if (X && Fc8(M)) return II6(M);
            let {
                allowed: P,
                resolvedPath: W,
                decisionReason: D
            } = pc8(M, z, K, j);
            if (X && fy6(W)) return II6(W);
            if (!P) {
                let Z = BY(w.name),
                    G = Array.from(qp(K)),
                    f = Bc8(G),
                    v = D?.type === "other" || D?.type === "safetyCheck" ? D.reason : `${Z} targeting '${W}' was blocked. For security, Claude Code may only access files in the allowed working directories for this session: ${f}.`;
                if (D?.type === "rule") return {
                    behavior: "deny",
                    message: v,
                    decisionReason: D
                };
                let V = [];
                if (W)
                    if (j === "read") {
                        let k = _j6(Yv(W), "session");
                        if (k) V.push(k)
                    } else V.push({
                        type: "addDirectories",
                        directories: [Yv(W)],
                        destination: "session"
                    });
                if ((j === "write" || j === "create") && (K.mode === "default" || K.mode === "plan")) V.push({
                    type: "setMode",
                    mode: "acceptEdits",
                    destination: "session"
                });
                Y ??= {
                    behavior: "ask",
                    message: v,
                    blockedPath: W,
                    decisionReason: D,
                    suggestions: V
                }
            }
        }
    }
    if (q.nestedCommands)
        for (let w of q.nestedCommands) {
            let {
                paths: $,
                operationType: j,
                hasUnvalidatablePathArg: H,
                optionalWrite: J
            } = dEK(w);
            if (H) {
                let M = BY(w.name);
                Y ??= {
                    behavior: "ask",
                    message: `${M} uses a parameter or complex path expression (array literal, subexpression, unknown parameter, etc.) that cannot be statically validated and requires manual approval`
                }
            }
            if (j !== "read" && !J && $.length === 0 && k_7[BY(w.name)]) {
                let M = BY(w.name);
                Y ??= {
                    behavior: "ask",
                    message: `${M} is a write operation but no target path could be determined; requires manual approval`
                };
                continue
            }
            let X = BY(w.name) === "remove-item";
            for (let M of $) {
                if (X && Fc8(M)) return II6(M);
                let {
                    allowed: P,
                    resolvedPath: W,
                    decisionReason: D
                } = pc8(M, z, K, j);
                if (X && fy6(W)) return II6(W);
                if (!P) {
                    let Z = BY(w.name),
                        G = Array.from(qp(K)),
                        f = Bc8(G),
                        v = D?.type === "other" || D?.type === "safetyCheck" ? D.reason : `${Z} targeting '${W}' was blocked. For security, Claude Code may only access files in the allowed working directories for this session: ${f}.`;
                    if (D?.type === "rule") return {
                        behavior: "deny",
                        message: v,
                        decisionReason: D
                    };
                    let V = [];
                    if (W)
                        if (j === "read") {
                            let k = _j6(Yv(W), "session");
                            if (k) V.push(k)
                        } else V.push({
                            type: "addDirectories",
                            directories: [Yv(W)],
                            destination: "session"
                        });
                    if ((j === "write" || j === "create") && (K.mode === "default" || K.mode === "plan")) V.push({
                        type: "setMode",
                        mode: "acceptEdits",
                        destination: "session"
                    });
                    Y ??= {
                        behavior: "ask",
                        message: v,
                        blockedPath: W,
                        decisionReason: D,
                        suggestions: V
                    }
                }
            }
            if (A) Y ??= {
                behavior: "ask",
                message: `${BY(w.name)} appears inside a control-flow or chain statement where piped expression sources cannot be statically validated and requires manual approval`
            }
        }
    if (q.nestedCommands) {
        for (let w of q.nestedCommands)
            if (w.redirections)
                for (let $ of w.redirections) {
                    if ($.isMerging) continue;
                    if (!$.target) continue;
                    if (CI6($.target)) continue;
                    let {
                        allowed: j,
                        resolvedPath: H,
                        decisionReason: J
                    } = pc8($.target, z, K, "create");
                    if (!j) {
                        let X = Array.from(qp(K)),
                            M = Bc8(X),
                            P = J?.type === "other" || J?.type === "safetyCheck" ? J.reason : `Output redirection to '${H}' was blocked. For security, Claude Code may only write to files in the allowed working directories for this session: ${M}.`;
                        if (J?.type === "rule") return {
                            behavior: "deny",
                            message: P,
                            decisionReason: J
                        };
                        Y ??= {
                            behavior: "ask",
                            message: P,
                            blockedPath: H,
                            decisionReason: J,
                            suggestions: [{
                                type: "addDirectories",
                                directories: [Yv(H)],
                                destination: "session"
                            }]
                        }
                    }
                }
    }
    if (q.redirections)
        for (let w of q.redirections) {
            if (w.isMerging) continue;
            if (!w.target) continue;
            if (CI6(w.target)) continue;
            let {
                allowed: $,
                resolvedPath: j,
                decisionReason: H
            } = pc8(w.target, z, K, "create");
            if (!$) {
                let J = Array.from(qp(K)),
                    X = Bc8(J),
                    M = H?.type === "other" || H?.type === "safetyCheck" ? H.reason : `Output redirection to '${j}' was blocked. For security, Claude Code may only write to files in the allowed working directories for this session: ${X}.`;
                if (H?.type === "rule") return {
                    behavior: "deny",
                    message: M,
                    decisionReason: H
                };
                Y ??= {
                    behavior: "ask",
                    message: M,
                    blockedPath: j,
                    decisionReason: H,
                    suggestions: [{
                        type: "addDirectories",
                        directories: [Yv(j)],
                        destination: "session"
                    }]
                }
            }
        }
    return Y ?? {
        behavior: "passthrough",
        message: "All path constraints validated successfully"
    }
}
// @from(Ln 406765, Col 4)
V_7 = 5
// @from(Ln 406766, Col 4)
cEK
// @from(Ln 406766, Col 9)
k_7
// @from(Ln 406766, Col 14)
bWY
// @from(Ln 406767, Col 4)
nEK = L(() => {
    n7();
    Yq();
    b9();
    Sz();
    MH();
    Gy6();
    NK();
    Re();
    D_7();
    bI6();
    cEK = /[*?[\]]/, k_7 = {
        "set-content": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-passthru", "-force", "-whatif", "-confirm", "-usetransaction", "-nonewline", "-asbytestream"],
            knownValueParams: ["-value", "-filter", "-include", "-exclude", "-credential", "-encoding", "-stream"]
        },
        "add-content": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-passthru", "-force", "-whatif", "-confirm", "-usetransaction", "-nonewline", "-asbytestream"],
            knownValueParams: ["-value", "-filter", "-include", "-exclude", "-credential", "-encoding", "-stream"]
        },
        "remove-item": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-recurse", "-force", "-whatif", "-confirm", "-usetransaction"],
            knownValueParams: ["-filter", "-include", "-exclude", "-credential", "-stream"]
        },
        "clear-content": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-force", "-whatif", "-confirm", "-usetransaction"],
            knownValueParams: ["-filter", "-include", "-exclude", "-credential", "-stream"]
        },
        "out-file": {
            operationType: "write",
            pathParams: ["-filepath", "-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-append", "-force", "-noclobber", "-nonewline", "-whatif", "-confirm"],
            knownValueParams: ["-inputobject", "-encoding", "-width"]
        },
        "tee-object": {
            operationType: "write",
            pathParams: ["-filepath", "-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-append"],
            knownValueParams: ["-inputobject", "-variable", "-encoding"]
        },
        "export-csv": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-append", "-force", "-noclobber", "-notypeinformation", "-includetypeinformation", "-useculture", "-noheader", "-whatif", "-confirm"],
            knownValueParams: ["-inputobject", "-delimiter", "-encoding", "-quotefields", "-usequotes"]
        },
        "export-clixml": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-force", "-noclobber", "-whatif", "-confirm"],
            knownValueParams: ["-inputobject", "-depth", "-encoding"]
        },
        "new-item": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            leafOnlyPathParams: ["-name"],
            knownSwitches: ["-force", "-whatif", "-confirm", "-usetransaction"],
            knownValueParams: ["-itemtype", "-value", "-credential", "-type"]
        },
        "copy-item": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp", "-destination"],
            knownSwitches: ["-container", "-force", "-passthru", "-recurse", "-whatif", "-confirm", "-usetransaction"],
            knownValueParams: ["-filter", "-include", "-exclude", "-credential", "-fromsession", "-tosession"]
        },
        "move-item": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp", "-destination"],
            knownSwitches: ["-force", "-passthru", "-whatif", "-confirm", "-usetransaction"],
            knownValueParams: ["-filter", "-include", "-exclude", "-credential"]
        },
        "rename-item": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-force", "-passthru", "-whatif", "-confirm", "-usetransaction"],
            knownValueParams: ["-newname", "-credential", "-filter", "-include", "-exclude"]
        },
        "set-item": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-force", "-passthru", "-whatif", "-confirm", "-usetransaction"],
            knownValueParams: ["-value", "-credential", "-filter", "-include", "-exclude"]
        },
        "get-content": {
            operationType: "read",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-force", "-usetransaction", "-wait", "-raw", "-asbytestream"],
            knownValueParams: ["-readcount", "-totalcount", "-tail", "-first", "-head", "-last", "-filter", "-include", "-exclude", "-credential", "-delimiter", "-encoding", "-stream"]
        },
        "get-childitem": {
            operationType: "read",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-recurse", "-force", "-name", "-usetransaction", "-followsymlink", "-directory", "-file", "-hidden", "-readonly", "-system"],
            knownValueParams: ["-filter", "-include", "-exclude", "-depth", "-attributes", "-credential"]
        },
        "get-item": {
            operationType: "read",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-force", "-usetransaction"],
            knownValueParams: ["-filter", "-include", "-exclude", "-credential", "-stream"]
        },
        "get-itemproperty": {
            operationType: "read",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-usetransaction"],
            knownValueParams: ["-name", "-filter", "-include", "-exclude", "-credential"]
        },
        "get-itempropertyvalue": {
            operationType: "read",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-usetransaction"],
            knownValueParams: ["-name", "-filter", "-include", "-exclude", "-credential"]
        },
        "get-filehash": {
            operationType: "read",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: [],
            knownValueParams: ["-algorithm", "-inputstream"]
        },
        "get-acl": {
            operationType: "read",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-audit", "-allcentralaccesspolicies", "-usetransaction"],
            knownValueParams: ["-inputobject", "-filter", "-include", "-exclude"]
        },
        "format-hex": {
            operationType: "read",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-raw"],
            knownValueParams: ["-inputobject", "-encoding", "-count", "-offset"]
        },
        "test-path": {
            operationType: "read",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-isvalid", "-usetransaction"],
            knownValueParams: ["-filter", "-include", "-exclude", "-pathtype", "-credential", "-olderthan", "-newerthan"]
        },
        "resolve-path": {
            operationType: "read",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-relative", "-usetransaction", "-force"],
            knownValueParams: ["-credential", "-relativebasepath"]
        },
        "convert-path": {
            operationType: "read",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-usetransaction"],
            knownValueParams: []
        },
        "select-string": {
            operationType: "read",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-simplematch", "-casesensitive", "-quiet", "-list", "-notmatch", "-allmatches", "-noemphasis", "-raw"],
            knownValueParams: ["-inputobject", "-pattern", "-include", "-exclude", "-encoding", "-context", "-culture"]
        },
        "set-location": {
            operationType: "read",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-passthru", "-usetransaction"],
            knownValueParams: ["-stackname"]
        },
        "push-location": {
            operationType: "read",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-passthru", "-usetransaction"],
            knownValueParams: ["-stackname"]
        },
        "pop-location": {
            operationType: "read",
            pathParams: [],
            knownSwitches: ["-passthru", "-usetransaction"],
            knownValueParams: ["-stackname"]
        },
        "select-xml": {
            operationType: "read",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: [],
            knownValueParams: ["-xml", "-content", "-xpath", "-namespace"]
        },
        "get-winevent": {
            operationType: "read",
            pathParams: ["-path"],
            knownSwitches: ["-force", "-oldest"],
            knownValueParams: ["-listlog", "-logname", "-listprovider", "-providername", "-maxevents", "-computername", "-credential", "-filterxpath", "-filterxml", "-filterhashtable"]
        },
        "invoke-webrequest": {
            operationType: "write",
            pathParams: ["-outfile", "-infile"],
            positionalSkip: 1,
            optionalWrite: !0,
            knownSwitches: ["-allowinsecureredirect", "-allowunencryptedauthentication", "-disablekeepalive", "-nobodyprogress", "-passthru", "-preservefileauthorizationmetadata", "-resume", "-skipcertificatecheck", "-skipheadervalidation", "-skiphttperrorcheck", "-usebasicparsing", "-usedefaultcredentials"],
            knownValueParams: ["-uri", "-method", "-body", "-contenttype", "-headers", "-maximumredirection", "-maximumretrycount", "-proxy", "-proxycredential", "-retryintervalsec", "-sessionvariable", "-timeoutsec", "-token", "-transferencoding", "-useragent", "-websession", "-credential", "-authentication", "-certificate", "-certificatethumbprint", "-form", "-httpversion"]
        },
        "invoke-restmethod": {
            operationType: "write",
            pathParams: ["-outfile", "-infile"],
            positionalSkip: 1,
            optionalWrite: !0,
            knownSwitches: ["-allowinsecureredirect", "-allowunencryptedauthentication", "-disablekeepalive", "-followrellink", "-nobodyprogress", "-passthru", "-preservefileauthorizationmetadata", "-resume", "-skipcertificatecheck", "-skipheadervalidation", "-skiphttperrorcheck", "-usebasicparsing", "-usedefaultcredentials"],
            knownValueParams: ["-uri", "-method", "-body", "-contenttype", "-headers", "-maximumfollowrellink", "-maximumredirection", "-maximumretrycount", "-proxy", "-proxycredential", "-responseheaderstvariable", "-retryintervalsec", "-sessionvariable", "-statuscodevariable", "-timeoutsec", "-token", "-transferencoding", "-useragent", "-websession", "-credential", "-authentication", "-certificate", "-certificatethumbprint", "-form", "-httpversion"]
        },
        "expand-archive": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp", "-destinationpath"],
            knownSwitches: ["-force", "-passthru", "-whatif", "-confirm"],
            knownValueParams: []
        },
        "compress-archive": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp", "-destinationpath"],
            knownSwitches: ["-force", "-update", "-passthru", "-whatif", "-confirm"],
            knownValueParams: ["-compressionlevel"]
        },
        "set-itemproperty": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-passthru", "-force", "-whatif", "-confirm", "-usetransaction"],
            knownValueParams: ["-name", "-value", "-type", "-filter", "-include", "-exclude", "-credential", "-inputobject"]
        },
        "new-itemproperty": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-force", "-whatif", "-confirm", "-usetransaction"],
            knownValueParams: ["-name", "-value", "-propertytype", "-type", "-filter", "-include", "-exclude", "-credential"]
        },
        "remove-itemproperty": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-force", "-whatif", "-confirm", "-usetransaction"],
            knownValueParams: ["-name", "-filter", "-include", "-exclude", "-credential"]
        },
        "clear-item": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-force", "-whatif", "-confirm", "-usetransaction"],
            knownValueParams: ["-filter", "-include", "-exclude", "-credential"]
        },
        "export-alias": {
            operationType: "write",
            pathParams: ["-path", "-literalpath", "-pspath", "-lp"],
            knownSwitches: ["-append", "-force", "-noclobber", "-passthru", "-whatif", "-confirm"],
            knownValueParams: ["-name", "-description", "-scope", "-as"]
        }
    };
    bWY = new Set(["StringConstant", "Parameter"])
})
// @from(Ln 407021, Col 4)
p38
// @from(Ln 407021, Col 9)
iEK
// @from(Ln 407022, Col 4)
y_7 = L(() => {
    p38 = ["python", "python3", "python2", "node", "deno", "tsx", "ruby", "perl", "php", "lua", "npx", "bunx", "npm run", "yarn run", "pnpm run", "bun run", "bash", "sh", "ssh"], iEK = [...p38, "zsh", "fish", "eval", "exec", "env", "xargs", "sudo", ...[]]
})
// @from(Ln 407026, Col 0)
function uWY(q) {
    return Object.entries(Hn).filter(([, K]) => q.has(K.toLowerCase())).map(([K]) => K)
}
// @from(Ln 407029, Col 4)
L_7
// @from(Ln 407029, Col 9)
h_7
// @from(Ln 407029, Col 14)
R_7
// @from(Ln 407029, Col 19)
xWY
// @from(Ln 407029, Col 24)
mWY
// @from(Ln 407029, Col 29)
BWY
// @from(Ln 407029, Col 34)
pWY
// @from(Ln 407029, Col 39)
FWY
// @from(Ln 407029, Col 44)
rEK
// @from(Ln 407030, Col 4)
S_7 = L(() => {
    y_7();
    Re();
    L_7 = new Set(["invoke-command", "start-job", "start-threadjob", "register-scheduledjob"]), h_7 = new Set(["invoke-command", "invoke-expression", "start-job", "start-threadjob", "register-scheduledjob", "register-engineevent", "register-objectevent", "register-wmievent", "new-pssession", "enter-pssession"]), R_7 = new Set(["import-module", "ipmo", "install-module", "save-module", "update-module", "install-script", "save-script"]), xWY = ["pwsh", "powershell", "cmd", "bash", "wsl", "sh", "start-process", "start", "add-type", "new-object"];
    mWY = new Set(["invoke-webrequest", "invoke-restmethod"]), BWY = new Set(["set-alias", "sal", "new-alias", "nal", "set-variable", "sv", "new-variable", "nv"]), pWY = new Set(["invoke-wmimethod", "iwmi", "invoke-cimmethod"]), FWY = new Set(["select-object", "sort-object", "group-object", "where-object", "measure-object", "write-output", "write-host", "start-sleep", "format-table", "format-list", "format-wide", "format-custom", "out-string", "out-host", "ipconfig", "hostname", "route", "arp"]), rEK = (() => {
        let q = new Set([...xWY, ...L_7, ...h_7, ...R_7, ...mWY, ...BWY, ...pWY, ...FWY, "foreach-object", ...p38.filter((K) => !K.includes(" "))]);
        return new Set([...q, ...uWY(q)])
    })()
})
// @from(Ln 407040, Col 0)
function UWY(q) {
    return q.toLowerCase().replace(/\[\]$/, "").replace(/\[.*\]$/, "").trim()
}
// @from(Ln 407044, Col 0)
function C_7(q) {
    return gWY.has(UWY(q))
}
// @from(Ln 407047, Col 4)
gWY
// @from(Ln 407048, Col 4)
oEK = L(() => {
    gWY = new Set(["alias", "allowemptycollection", "allowemptystring", "allownull", "argumentcompleter", "argumentcompletions", "array", "bigint", "bool", "byte", "char", "cimclass", "cimconverter", "ciminstance", "cimtype", "cmdletbinding", "cultureinfo", "datetime", "decimal", "double", "dsclocalconfigurationmanager", "dscproperty", "dscresource", "experimentaction", "experimental", "experimentalfeature", "float", "guid", "hashtable", "int", "int16", "int32", "int64", "ipaddress", "ipendpoint", "long", "mailaddress", "norunspaceaffinity", "nullstring", "objectsecurity", "ordered", "outputtype", "parameter", "physicaladdress", "pscredential", "pscustomobject", "psdefaultvalue", "pslistmodifier", "psobject", "psprimitivedictionary", "pstypenameattribute", "ref", "regex", "sbyte", "securestring", "semver", "short", "single", "string", "supportswildcards", "switch", "timespan", "uint", "uint16", "uint32", "uint64", "ulong", "uri", "ushort", "validatecount", "validatedrive", "validatelength", "validatenotnull", "validatenotnullorempty", "validatenotnullorwhitespace", "validatepattern", "validaterange", "validatescript", "validateset", "validatetrusteddata", "validateuserdrive", "version", "void", "wildcardpattern", "x500distinguishedname", "x509certificate", "xml", "system.array", "system.boolean", "system.byte", "system.char", "system.datetime", "system.decimal", "system.double", "system.guid", "system.int16", "system.int32", "system.int64", "system.numerics.biginteger", "system.sbyte", "system.single", "system.string", "system.timespan", "system.uint16", "system.uint32", "system.uint64", "system.uri", "system.version", "system.void", "system.collections.hashtable", "system.text.regularexpressions.regex", "system.globalization.cultureinfo", "system.net.ipaddress", "system.net.ipendpoint", "system.net.mail.mailaddress", "system.net.networkinformation.physicaladdress", "system.security.securestring", "system.security.cryptography.x509certificates.x509certificate", "system.security.cryptography.x509certificates.x500distinguishedname", "system.xml.xmldocument", "system.management.automation.pscredential", "system.management.automation.pscustomobject", "system.management.automation.pslistmodifier", "system.management.automation.psobject", "system.management.automation.psprimitivedictionary", "system.management.automation.psreference", "system.management.automation.semanticversion", "system.management.automation.switchparameter", "system.management.automation.wildcardpattern", "system.management.automation.language.nullstring", "microsoft.management.infrastructure.cimclass", "microsoft.management.infrastructure.cimconverter", "microsoft.management.infrastructure.ciminstance", "microsoft.management.infrastructure.cimtype", "system.collections.specialized.ordereddictionary", "system.security.accesscontrol.objectsecurity", "object", "system.object", "microsoft.powershell.commands.modulespecification"].map((q) => q.toLowerCase()))
})
// @from(Ln 407052, Col 0)
function b_7(q) {
    let K = q.toLowerCase();
    if (aEK.has(K)) return !0;
    let _ = Math.max(K.lastIndexOf("/"), K.lastIndexOf("\\"));
    if (_ >= 0) return aEK.has(K.slice(_ + 1));
    return !1
}
// @from(Ln 407060, Col 0)
function uI6(q, K, _) {
    if (M_7(q, K, _)) return !0;
    let z = {
        ...q,
        args: q.args.map((Y) => Y.length > 0 && QWY.has(Y[0]) ? "-" + Y.slice(1) : Y)
    };
    return M_7(z, K, _)
}
// @from(Ln 407069, Col 0)
function dWY(q) {
    if (X_7(q, "Invoke-Expression")) return {
        behavior: "ask",
        message: "Command uses Invoke-Expression which can execute arbitrary code"
    };
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407079, Col 0)
function cWY(q) {
    for (let K of AW(q)) {
        if (K.elementType !== "CommandAst") continue;
        let _ = K.elementTypes?.[0];
        if (_ !== void 0 && _ !== "StringConstant") return {
            behavior: "ask",
            message: "Command name is a dynamic expression which cannot be statically validated"
        }
    }
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407093, Col 0)
function lWY(q) {
    for (let K of AW(q))
        if (b_7(K.name)) {
            if (uI6(K, "-encodedcommand", "-e")) return {
                behavior: "ask",
                message: "Command uses encoded parameters which obscure intent"
            }
        } return {
        behavior: "passthrough"
    }
}
// @from(Ln 407105, Col 0)
function nWY(q) {
    for (let K of AW(q))
        if (b_7(K.name)) return {
            behavior: "ask",
            message: "Command spawns a nested PowerShell process which cannot be validated"
        };
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407116, Col 0)
function sEK(q) {
    return iWY.has(q.toLowerCase())
}
// @from(Ln 407120, Col 0)
function tEK(q) {
    let K = q.toLowerCase();
    return K === "invoke-expression" || K === "iex"
}
// @from(Ln 407125, Col 0)
function rWY(q) {
    for (let _ of q.statements) {
        let z = _.commands;
        if (z.length < 2) continue;
        let Y = z.some((O) => sEK(O.name)),
            A = z.some((O) => tEK(O.name));
        if (Y && A) return {
            behavior: "ask",
            message: "Command downloads and executes remote code"
        }
    }
    let K = AW(q);
    if (K.some((_) => sEK(_.name)) && K.some((_) => tEK(_.name))) return {
        behavior: "ask",
        message: "Command downloads and executes remote code"
    };
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407146, Col 0)
function oWY(q) {
    for (let K of AW(q)) {
        let _ = K.name.toLowerCase();
        if (_ === "start-bitstransfer") return {
            behavior: "ask",
            message: "Command downloads files via BITS transfer"
        };
        if (_ === "certutil" || _ === "certutil.exe") {
            if (K.args.some((Y) => {
                    let A = Y.toLowerCase();
                    return A === "-urlcache" || A === "/urlcache"
                })) return {
                behavior: "ask",
                message: "Command uses certutil to download from a URL"
            }
        }
        if (_ === "bitsadmin" || _ === "bitsadmin.exe") {
            if (K.args.some((z) => z.toLowerCase() === "/transfer")) return {
                behavior: "ask",
                message: "Command downloads files via BITS transfer"
            }
        }
    }
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407174, Col 0)
function aWY(q) {
    if (X_7(q, "Add-Type")) return {
        behavior: "ask",
        message: "Command compiles and loads .NET code"
    };
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407184, Col 0)
function sWY(q) {
    for (let K of AW(q)) {
        if (K.name.toLowerCase() !== "new-object") continue;
        if (uI6(K, "-comobject", "-com")) return {
            behavior: "ask",
            message: "Command instantiates a COM object which may have execution capabilities"
        };
        let _;
        for (let z = 0; z < K.args.length; z++) {
            let Y = K.args[z],
                A = Y.toLowerCase();
            if (A.startsWith("-t") && A.includes(":")) {
                let O = Y.indexOf(":"),
                    w = A.slice(0, O);
                if ("-typename".startsWith(w)) {
                    _ = Y.slice(O + 1);
                    break
                }
            }
            if (A.startsWith("-t") && "-typename".startsWith(A) && K.args[z + 1] !== void 0) {
                _ = K.args[z + 1];
                break
            }
        }
        if (_ === void 0) {
            let z = new Set(["-argumentlist", "-comobject", "-property"]),
                Y = new Set(["-strict"]);
            for (let A = 0; A < K.args.length; A++) {
                let O = K.args[A];
                if (O.startsWith("-")) {
                    let w = O.toLowerCase();
                    if (w.startsWith("-t") && "-typename".startsWith(w)) {
                        A++;
                        continue
                    }
                    if (w.includes(":")) continue;
                    if (Y.has(w)) continue;
                    if (z.has(w)) {
                        A++;
                        continue
                    }
                    continue
                }
                _ = O;
                break
            }
        }
        if (_ !== void 0 && !C_7(_)) return {
            behavior: "ask",
            message: `New-Object instantiates .NET type '${_}' outside the ConstrainedLanguage allowlist`
        }
    }
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407241, Col 0)
function tWY(q) {
    for (let K of AW(q)) {
        let _ = K.name.toLowerCase(),
            z = Hn[_]?.toLowerCase() ?? _;
        if (!L_7.has(z)) continue;
        if (uI6(K, "-filepath", "-f") || uI6(K, "-literalpath", "-l")) return {
            behavior: "ask",
            message: `${K.name} -FilePath executes an arbitrary script file`
        };
        for (let Y = 0; Y < K.args.length; Y++) {
            let A = K.elementTypes?.[Y + 1],
                O = K.args[Y];
            if (A === "StringConstant" && O && !O.startsWith("-")) return {
                behavior: "ask",
                message: `${K.name} with positional string argument binds to -FilePath and executes a script file`
            }
        }
    }
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407264, Col 0)
function eWY(q) {
    for (let K of AW(q)) {
        let _ = K.name.toLowerCase();
        if ((Hn[_]?.toLowerCase() ?? _) !== "foreach-object") continue;
        if (uI6(K, "-membername", "-m")) return {
            behavior: "ask",
            message: "ForEach-Object -MemberName invokes methods by string name which cannot be validated"
        };
        for (let Y = 0; Y < K.args.length; Y++) {
            let A = K.elementTypes?.[Y + 1],
                O = K.args[Y];
            if (A === "StringConstant" && O && !O.startsWith("-")) return {
                behavior: "ask",
                message: "ForEach-Object with positional string argument binds to -MemberName and invokes methods by name"
            }
        }
    }
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407286, Col 0)
function q0Y(q) {
    for (let K of AW(q)) {
        let _ = K.name.toLowerCase();
        if (_ !== "start-process" && _ !== "saps" && _ !== "start") continue;
        if (uI6(K, "-Verb", "-v") && K.args.some((z) => z.toLowerCase() === "runas")) return {
            behavior: "ask",
            message: "Command requests elevated privileges"
        };
        if (K.children)
            for (let z = 0; z < K.args.length; z++) {
                let Y = K.args[z].replace(/`/g, "");
                if (!/^[-\u2013\u2014\u2015/]v[a-z]*:/i.test(Y)) continue;
                let A = K.children[z];
                if (!A) continue;
                for (let O of A)
                    if (O.text.replace(/['"`\s]/g, "").toLowerCase() === "runas") return {
                        behavior: "ask",
                        message: "Command requests elevated privileges"
                    }
            }
        if (K.args.some((z) => {
                let Y = z.replaceAll("`", "");
                return /^[-\u2013\u2014\u2015/]v[a-z]*:['"` ]*runas['"` ]*$/i.test(Y)
            })) return {
            behavior: "ask",
            message: "Command requests elevated privileges"
        };
        for (let z of K.args) {
            let Y = z.replace(/^['"]|['"]$/g, "");
            if (b_7(Y)) return {
                behavior: "ask",
                message: "Start-Process launches a nested PowerShell process which cannot be validated"
            }
        }
    }
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407326, Col 0)
function K0Y(q) {
    if (!wL(q).hasScriptBlocks) return {
        behavior: "passthrough"
    };
    for (let z of AW(q)) {
        let Y = z.name.toLowerCase();
        if (h_7.has(Y)) return {
            behavior: "ask",
            message: "Command contains script block with dangerous cmdlet that may execute arbitrary code"
        }
    }
    if (AW(q).every((z) => {
            let Y = z.name.toLowerCase();
            if (eEK.has(Y)) return !0;
            let A = Hn[Y];
            if (A && eEK.has(A.toLowerCase())) return !0;
            return !1
        })) return {
        behavior: "passthrough"
    };
    return {
        behavior: "ask",
        message: "Command contains script block that may execute arbitrary code"
    }
}
// @from(Ln 407352, Col 0)
function _0Y(q) {
    if (wL(q).hasSubExpressions) return {
        behavior: "ask",
        message: "Command contains subexpressions $()"
    };
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407362, Col 0)
function z0Y(q) {
    if (wL(q).hasExpandableStrings) return {
        behavior: "ask",
        message: "Command contains expandable strings with embedded expressions"
    };
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407372, Col 0)
function Y0Y(q) {
    if (wL(q).hasSplatting) return {
        behavior: "ask",
        message: "Command uses splatting (@variable)"
    };
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407382, Col 0)
function A0Y(q) {
    if (wL(q).hasStopParsing) return {
        behavior: "ask",
        message: "Command uses stop-parsing token (--%)"
    };
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407392, Col 0)
function O0Y(q) {
    if (wL(q).hasMemberInvocations) return {
        behavior: "ask",
        message: "Command invokes .NET methods"
    };
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407402, Col 0)
function w0Y(q) {
    for (let K of q.typeLiterals ?? [])
        if (!C_7(K)) return {
            behavior: "ask",
            message: `Command uses .NET type [${K}] outside the ConstrainedLanguage allowlist`
        };
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407413, Col 0)
function $0Y(q) {
    for (let K of AW(q)) {
        let _ = K.name.toLowerCase();
        if (_ === "invoke-item" || _ === "ii") return {
            behavior: "ask",
            message: "Invoke-Item opens files with the default handler (ShellExecute). On executable files this runs arbitrary code."
        }
    }
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407426, Col 0)
function H0Y(q) {
    for (let K of AW(q)) {
        let _ = K.name.toLowerCase();
        if (j0Y.has(_)) return {
            behavior: "ask",
            message: `${K.name} creates or modifies a scheduled task (persistence primitive)`
        };
        if (_ === "schtasks" || _ === "schtasks.exe") {
            if (K.args.some((z) => {
                    let Y = z.toLowerCase();
                    return Y === "/create" || Y === "/change" || Y === "-create" || Y === "-change"
                })) return {
                behavior: "ask",
                message: "schtasks with create/change modifies scheduled tasks (persistence primitive)"
            }
        }
    }
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407448, Col 0)
function X0Y(q) {
    let K = yEK(q, "env");
    if (K.length === 0) return {
        behavior: "passthrough"
    };
    for (let _ of AW(q))
        if (J0Y.has(_.name.toLowerCase())) return {
            behavior: "ask",
            message: "Command modifies environment variables"
        };
    if (wL(q).hasAssignments && K.length > 0) return {
        behavior: "ask",
        message: "Command modifies environment variables"
    };
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407467, Col 0)
function M0Y(q) {
    for (let K of AW(q)) {
        let _ = K.name.toLowerCase();
        if (R_7.has(_)) return {
            behavior: "ask",
            message: "Command loads, installs, or downloads a PowerShell module or script, which can execute arbitrary code"
        }
    }
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407480, Col 0)
function W0Y(q) {
    for (let K of AW(q)) {
        let _ = K.name.toLowerCase(),
            z = _.includes("\\") ? _.slice(_.lastIndexOf("\\") + 1) : _;
        if (P0Y.has(z)) return {
            behavior: "ask",
            message: "Command creates or modifies an alias or variable that can affect future command resolution"
        }
    }
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407494, Col 0)
function Z0Y(q) {
    for (let K of AW(q)) {
        let _ = K.name.toLowerCase();
        if (D0Y.has(_)) return {
            behavior: "ask",
            message: `${K.name} can spawn arbitrary processes via WMI/CIM (Win32_Process Create)`
        }
    }
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407507, Col 0)
function qyK(q, K) {
    if (!K.valid) return {
        behavior: "ask",
        message: "Could not parse command for security analysis"
    };
    let _ = [dWY, cWY, lWY, nWY, rWY, oWY, aWY, sWY, tWY, $0Y, H0Y, eWY, q0Y, K0Y, _0Y, z0Y, Y0Y, A0Y, O0Y, w0Y, X0Y, M0Y, W0Y, Z0Y];
    for (let z of _) {
        let Y = z(K);
        if (Y.behavior === "ask") return Y
    }
    return {
        behavior: "passthrough"
    }
}
// @from(Ln 407521, Col 4)
aEK
// @from(Ln 407521, Col 9)
QWY
// @from(Ln 407521, Col 14)
iWY