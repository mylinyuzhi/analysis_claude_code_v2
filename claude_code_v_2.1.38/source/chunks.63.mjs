
// @from(Ln 164586, Col 0)
class LU {
    constructor(A) {
        this.azureFederatedTokenFileContent = void 0, this.cacheDate = void 0;
        let q = y56(vl5).assigned.join(", ");
        VI1.info(`Found the following environment variables: ${q}`);
        let K = A !== null && A !== void 0 ? A : {},
            Y = K.tenantId || process.env.AZURE_TENANT_ID,
            z = K.clientId || process.env.AZURE_CLIENT_ID;
        if (this.federatedTokenFilePath = K.tokenFilePath || process.env.AZURE_FEDERATED_TOKEN_FILE, Y) NX(VI1, Y);
        if (!z) throw new f4(`${p41}: is unavailable. clientId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_CLIENT_ID".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
        if (!Y) throw new f4(`${p41}: is unavailable. tenantId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_TENANT_ID".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
        if (!this.federatedTokenFilePath) throw new f4(`${p41}: is unavailable. federatedTokenFilePath is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_FEDERATED_TOKEN_FILE".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
        VI1.info(`Invoking ClientAssertionCredential with tenant ID: ${Y}, clientId: ${K.clientId} and federated token path: [REDACTED]`), this.client = new U41(Y, z, this.readFileContents.bind(this), A)
    }
    async getToken(A, q) {
        if (!this.client) {
            let K = `${p41}: is unavailable. tenantId, clientId, and federatedTokenFilePath are required parameters. 
      In DefaultAzureCredential and ManagedIdentityCredential, these can be provided as environment variables - 
      "AZURE_TENANT_ID",
      "AZURE_CLIENT_ID",
      "AZURE_FEDERATED_TOKEN_FILE". See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`;
            throw VI1.info(K), new f4(K)
        }
        return VI1.info("Invoking getToken() of Client Assertion Credential"), this.client.getToken(A, q)
    }
    async readFileContents() {
        if (this.cacheDate !== void 0 && Date.now() - this.cacheDate >= 300000) this.azureFederatedTokenFileContent = void 0;
        if (!this.federatedTokenFilePath) throw new f4(`${p41}: is unavailable. Invalid file path provided ${this.federatedTokenFilePath}.`);
        if (!this.azureFederatedTokenFileContent) {
            let q = (await Tl5(this.federatedTokenFilePath, "utf8")).trim();
            if (!q) throw new f4(`${p41}: is unavailable. No content on the file ${this.federatedTokenFilePath}.`);
            else this.azureFederatedTokenFileContent = q, this.cacheDate = Date.now()
        }
        return this.azureFederatedTokenFileContent
    }
}
// @from(Ln 164625, Col 4)
p41 = "WorkloadIdentityCredential"
// @from(Ln 164626, Col 4)
vl5
// @from(Ln 164626, Col 9)
VI1
// @from(Ln 164627, Col 4)
nY6 = v(() => {
    t2();
    iY6();
    bD();
    uD();
    vl5 = ["AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_FEDERATED_TOKEN_FILE"], VI1 = n3(p41)
})
// @from(Ln 164634, Col 4)
a07 = "ManagedIdentityCredential - Token Exchange"
// @from(Ln 164635, Col 4)
El5
// @from(Ln 164635, Col 9)
IzA
// @from(Ln 164636, Col 4)
s07 = v(() => {
    nY6();
    t2();
    El5 = n3(a07), IzA = {
        name: "tokenExchangeMsi",
        async isAvailable(A) {
            let q = process.env,
                K = Boolean((A || q.AZURE_CLIENT_ID) && q.AZURE_TENANT_ID && process.env.AZURE_FEDERATED_TOKEN_FILE);
            if (!K) El5.info(`${a07}: Unavailable. The environment variables needed are: AZURE_CLIENT_ID (or the client ID sent through the parameters), AZURE_TENANT_ID and AZURE_FEDERATED_TOKEN_FILE`);
            return K
        },
        async getToken(A, q = {}) {
            let {
                scopes: K,
                clientId: Y
            } = A, z = {};
            return new LU(Object.assign(Object.assign({
                clientId: Y,
                tenantId: process.env.AZURE_TENANT_ID,
                tokenFilePath: process.env.AZURE_FEDERATED_TOKEN_FILE
            }, z), {
                disableInstanceDiscovery: !0
            })).getToken(K, q)
        }
    }
})
// @from(Ln 164662, Col 0)
class Jo {
    constructor(A, q) {
        var K, Y;
        this.msiRetryConfig = {
            maxRetries: 5,
            startDelayInMs: 800,
            intervalIncrement: 2
        };
        let z;
        if (typeof A === "string") this.clientId = A, z = q !== null && q !== void 0 ? q : {};
        else this.clientId = A === null || A === void 0 ? void 0 : A.clientId, z = A !== null && A !== void 0 ? A : {};
        this.resourceId = z === null || z === void 0 ? void 0 : z.resourceId, this.objectId = z === null || z === void 0 ? void 0 : z.objectId;
        let w = [{
            key: "clientId",
            value: this.clientId
        }, {
            key: "resourceId",
            value: this.resourceId
        }, {
            key: "objectId",
            value: this.objectId
        }].filter(($) => $.value);
        if (w.length > 1) throw Error(`ManagedIdentityCredential: only one of 'clientId', 'resourceId', or 'objectId' can be provided. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}`);
        if (z.allowInsecureConnection = !0, ((K = z.retryOptions) === null || K === void 0 ? void 0 : K.maxRetries) !== void 0) this.msiRetryConfig.maxRetries = z.retryOptions.maxRetries;
        this.identityClient = new yu(Object.assign(Object.assign({}, z), {
            additionalPolicies: [{
                policy: v07(this.msiRetryConfig),
                position: "perCall"
            }]
        })), this.managedIdentityApp = new Qu({
            managedIdentityIdParams: {
                userAssignedClientId: this.clientId,
                userAssignedResourceId: this.resourceId,
                userAssignedObjectId: this.objectId
            },
            system: {
                disableInternalRetries: !0,
                networkClient: this.identityClient,
                loggerOptions: {
                    logLevel: pY6(R56()),
                    piiLoggingEnabled: (Y = z.loggingOptions) === null || Y === void 0 ? void 0 : Y.enableUnsafeSupportLogging,
                    loggerCallback: UY6(Dv)
                }
            }
        }), this.isAvailableIdentityClient = new yu(Object.assign(Object.assign({}, z), {
            retryOptions: {
                maxRetries: 0
            }
        }));
        let H = this.managedIdentityApp.getManagedIdentitySource();
        if (H === "CloudShell") {
            if (this.clientId || this.resourceId || this.objectId) throw Dv.warning(`CloudShell MSI detected with user-provided IDs - throwing. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}.`), new f4("ManagedIdentityCredential: Specifying a user-assigned managed identity is not supported for CloudShell at runtime. When using Managed Identity in CloudShell, omit the clientId, resourceId, and objectId parameters.")
        }
        if (H === "ServiceFabric") {
            if (this.clientId || this.resourceId || this.objectId) throw Dv.warning(`Service Fabric detected with user-provided IDs - throwing. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}.`), new f4(`ManagedIdentityCredential: ${O$7}`)
        }
        if (Dv.info(`Using ${H} managed identity.`), w.length === 1) {
            let {
                key: $,
                value: O
            } = w[0];
            Dv.info(`${H} with ${$}: ${O}`)
        }
    }
    async getToken(A, q = {}) {
        Dv.getToken.info("Using the MSAL provider for Managed Identity.");
        let K = uS1(A);
        if (!K) throw new f4(`ManagedIdentityCredential: Multiple scopes are not supported. Scopes: ${JSON.stringify(A)}`);
        return RY.withSpan("ManagedIdentityCredential.getToken", q, async () => {
            var Y;
            try {
                let z = await IzA.isAvailable(this.clientId),
                    w = this.managedIdentityApp.getManagedIdentitySource(),
                    H = w === "DefaultToImds" || w === "Imds";
                if (Dv.getToken.info(`MSAL Identity source: ${w}`), z) {
                    Dv.getToken.info("Using the token exchange managed identity.");
                    let O = await IzA.getToken({
                        scopes: A,
                        clientId: this.clientId,
                        identityClient: this.identityClient,
                        retryConfig: this.msiRetryConfig,
                        resourceId: this.resourceId
                    });
                    if (O === null) throw new f4("Attempted to use the token exchange managed identity, but received a null response.");
                    return O
                } else if (H) {
                    if (Dv.getToken.info("Using the IMDS endpoint to probe for availability."), !await WzA.isAvailable({
                            scopes: A,
                            clientId: this.clientId,
                            getTokenOptions: q,
                            identityClient: this.isAvailableIdentityClient,
                            resourceId: this.resourceId
                        })) throw new f4("Attempted to use the IMDS endpoint, but it is not available.")
                }
                Dv.getToken.info("Calling into MSAL for managed identity token.");
                let $ = await this.managedIdentityApp.acquireToken({
                    resource: K
                });
                return this.ensureValidMsalToken(A, $, q), Dv.getToken.info(VX(A)), {
                    expiresOnTimestamp: $.expiresOn.getTime(),
                    token: $.accessToken,
                    refreshAfterTimestamp: (Y = $.refreshOn) === null || Y === void 0 ? void 0 : Y.getTime(),
                    tokenType: "Bearer"
                }
            } catch (z) {
                if (Dv.getToken.error(e9(A, z)), z.name === "AuthenticationRequiredError") throw z;
                if (kl5(z)) throw new f4(`ManagedIdentityCredential: Network unreachable. Message: ${z.message}`, {
                    cause: z
                });
                throw new f4(`ManagedIdentityCredential: Authentication failed. Message ${z.message}`, {
                    cause: z
                })
            }
        })
    }
    ensureValidMsalToken(A, q, K) {
        let Y = (z) => {
            return Dv.getToken.info(z), new fS({
                scopes: Array.isArray(A) ? A : [A],
                getTokenOptions: K,
                message: z
            })
        };
        if (!q) throw Y("No response.");
        if (!q.expiresOn) throw Y('Response had no "expiresOn" property.');
        if (!q.accessToken) throw Y('Response had no "accessToken" property.')
    }
}
// @from(Ln 164791, Col 0)
function kl5(A) {
    if (A.errorCode === "network_error") return !0;
    if (A.code === "ENETUNREACH" || A.code === "EHOSTUNREACH") return !0;
    if (A.statusCode === 403 || A.code === 403) {
        if (A.message.includes("unreachable")) return !0
    }
    return !1
}
// @from(Ln 164799, Col 4)
Dv
// @from(Ln 164800, Col 4)
xzA = v(() => {
    I71();
    gY6();
    mS1();
    bD();
    dY6();
    E07();
    t2();
    fM();
    k07();
    s07();
    Dv = n3("ManagedIdentityCredential")
})
// @from(Ln 164814, Col 0)
function jv(A) {
    return Array.isArray(A) ? A : [A]
}
// @from(Ln 164818, Col 0)
function EX1(A, q) {
    if (!A.match(/^[0-9a-zA-Z-_.:/]+$/)) {
        let K = Error("Invalid scope was specified by the user or calling client");
        throw q.getToken.info(e9(A, K)), K
    }
}
// @from(Ln 164825, Col 0)
function rY6(A) {
    return A.replace(/\/.default$/, "")
}
// @from(Ln 164828, Col 4)
gu = v(() => {
    t2()
})
// @from(Ln 164832, Col 0)
function bzA(A, q) {
    if (!q.match(/^[0-9a-zA-Z-._ ]+$/)) {
        let K = Error("Invalid subscription provided. You can locate your subscription by following the instructions listed here: https://learn.microsoft.com/azure/azure-portal/get-subscription-tenant-id.");
        throw A.info(e9("", K)), K
    }
}
// @from(Ln 164838, Col 4)
t07 = v(() => {
    t2()
})
// @from(Ln 164842, Col 0)
class NI1 {
    constructor(A) {
        if (A === null || A === void 0 ? void 0 : A.tenantId) NX(xL, A === null || A === void 0 ? void 0 : A.tenantId), this.tenantId = A === null || A === void 0 ? void 0 : A.tenantId;
        if (A === null || A === void 0 ? void 0 : A.subscription) bzA(xL, A === null || A === void 0 ? void 0 : A.subscription), this.subscription = A === null || A === void 0 ? void 0 : A.subscription;
        this.additionallyAllowedTenantIds = m$(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), this.timeout = A === null || A === void 0 ? void 0 : A.processTimeoutInMs
    }
    async getToken(A, q = {}) {
        let K = rH(this.tenantId, q, this.additionallyAllowedTenantIds);
        if (K) NX(xL, K);
        if (this.subscription) bzA(xL, this.subscription);
        let Y = typeof A === "string" ? A : A[0];
        return xL.getToken.info(`Using the scope ${Y}`), RY.withSpan(`${this.constructor.name}.getToken`, q, async () => {
            var z, w, H, $;
            try {
                EX1(Y, xL);
                let O = rY6(Y),
                    _ = await e07.getAzureCliAccessToken(O, K, this.subscription, this.timeout),
                    J = (z = _.stderr) === null || z === void 0 ? void 0 : z.match("(.*)az login --scope(.*)"),
                    X = ((w = _.stderr) === null || w === void 0 ? void 0 : w.match("(.*)az login(.*)")) && !J;
                if (((H = _.stderr) === null || H === void 0 ? void 0 : H.match("az:(.*)not found")) || (($ = _.stderr) === null || $ === void 0 ? void 0 : $.startsWith("'az' is not recognized"))) {
                    let j = new f4("Azure CLI could not be found. Please visit https://aka.ms/azure-cli for installation instructions and then, once installed, authenticate to your Azure account using 'az login'.");
                    throw xL.getToken.info(e9(A, j)), j
                }
                if (X) {
                    let j = new f4("Please run 'az login' from a command prompt to authenticate before using this credential.");
                    throw xL.getToken.info(e9(A, j)), j
                }
                try {
                    let j = _.stdout,
                        M = this.parseRawResponse(j);
                    return xL.getToken.info(VX(A)), M
                } catch (j) {
                    if (_.stderr) throw new f4(_.stderr);
                    throw j
                }
            } catch (O) {
                let _ = O.name === "CredentialUnavailableError" ? O : new f4(O.message || "Unknown error while trying to retrieve the access token");
                throw xL.getToken.info(e9(A, _)), _
            }
        })
    }
    parseRawResponse(A) {
        let q = JSON.parse(A),
            K = q.accessToken,
            Y = Number.parseInt(q.expires_on, 10) * 1000;
        if (!isNaN(Y)) return xL.getToken.info("expires_on is available and is valid, using it"), {
            token: K,
            expiresOnTimestamp: Y,
            tokenType: "Bearer"
        };
        if (Y = new Date(q.expiresOn).getTime(), isNaN(Y)) throw new f4(`Unexpected response from Azure CLI when getting token. Expected "expiresOn" to be a RFC3339 date string. Got: "${q.expiresOn}"`);
        return {
            token: K,
            expiresOnTimestamp: Y,
            tokenType: "Bearer"
        }
    }
}
// @from(Ln 164900, Col 4)
xL
// @from(Ln 164900, Col 8)
e07
// @from(Ln 164901, Col 4)
uzA = v(() => {
    uD();
    t2();
    gu();
    bD();
    fM();
    t07();
    xL = n3("AzureCliCredential"), e07 = {
        getSafeWorkingDir() {
            if (process.platform === "win32") {
                let A = process.env.SystemRoot || process.env.SYSTEMROOT;
                if (!A) xL.getToken.warning("The SystemRoot environment variable is not set. This may cause issues when using the Azure CLI credential."), A = "C:\\Windows";
                return A
            } else return "/bin"
        },
        async getAzureCliAccessToken(A, q, K, Y) {
            let z = [],
                w = [];
            if (q) z = ["--tenant", q];
            if (K) w = ["--subscription", `"${K}"`];
            return new Promise((H, $) => {
                try {
                    Ll5.execFile("az", ["account", "get-access-token", "--output", "json", "--resource", A, ...z, ...w], {
                        cwd: e07.getSafeWorkingDir(),
                        shell: !0,
                        timeout: Y
                    }, (O, _, J) => {
                        H({
                            stdout: _,
                            stderr: J,
                            error: O
                        })
                    })
                } catch (O) {
                    $(O)
                }
            })
        }
    }
})
// @from(Ln 164942, Col 0)
class TI1 {
    constructor(A) {
        if (A === null || A === void 0 ? void 0 : A.tenantId) NX(RU, A === null || A === void 0 ? void 0 : A.tenantId), this.tenantId = A === null || A === void 0 ? void 0 : A.tenantId;
        this.additionallyAllowedTenantIds = m$(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), this.timeout = A === null || A === void 0 ? void 0 : A.processTimeoutInMs
    }
    async getToken(A, q = {}) {
        let K = rH(this.tenantId, q, this.additionallyAllowedTenantIds);
        if (K) NX(RU, K);
        let Y;
        if (typeof A === "string") Y = [A];
        else Y = A;
        return RU.getToken.info(`Using the scopes ${A}`), RY.withSpan(`${this.constructor.name}.getToken`, q, async () => {
            var z, w, H, $;
            try {
                Y.forEach((X) => {
                    EX1(X, RU)
                });
                let O = await Aj7.getAzdAccessToken(Y, K, this.timeout),
                    _ = ((z = O.stderr) === null || z === void 0 ? void 0 : z.match("not logged in, run `azd login` to login")) || ((w = O.stderr) === null || w === void 0 ? void 0 : w.match("not logged in, run `azd auth login` to login"));
                if (((H = O.stderr) === null || H === void 0 ? void 0 : H.match("azd:(.*)not found")) || (($ = O.stderr) === null || $ === void 0 ? void 0 : $.startsWith("'azd' is not recognized")) || O.error && O.error.code === "ENOENT") {
                    let X = new f4("Azure Developer CLI couldn't be found. To mitigate this issue, see the troubleshooting guidelines at https://aka.ms/azsdk/js/identity/azdevclicredential/troubleshoot.");
                    throw RU.getToken.info(e9(A, X)), X
                }
                if (_) {
                    let X = new f4("Please run 'azd auth login' from a command prompt to authenticate before using this credential. For more information, see the troubleshooting guidelines at https://aka.ms/azsdk/js/identity/azdevclicredential/troubleshoot.");
                    throw RU.getToken.info(e9(A, X)), X
                }
                try {
                    let X = JSON.parse(O.stdout);
                    return RU.getToken.info(VX(A)), {
                        token: X.token,
                        expiresOnTimestamp: new Date(X.expiresOn).getTime(),
                        tokenType: "Bearer"
                    }
                } catch (X) {
                    if (O.stderr) throw new f4(O.stderr);
                    throw X
                }
            } catch (O) {
                let _ = O.name === "CredentialUnavailableError" ? O : new f4(O.message || "Unknown error while trying to retrieve the access token");
                throw RU.getToken.info(e9(A, _)), _
            }
        })
    }
}
// @from(Ln 164987, Col 4)
RU
// @from(Ln 164987, Col 8)
Aj7
// @from(Ln 164988, Col 4)
BzA = v(() => {
    t2();
    bD();
    uD();
    fM();
    gu();
    RU = n3("AzureDeveloperCliCredential"), Aj7 = {
        getSafeWorkingDir() {
            if (process.platform === "win32") {
                let A = process.env.SystemRoot || process.env.SYSTEMROOT;
                if (!A) RU.getToken.warning("The SystemRoot environment variable is not set. This may cause issues when using the Azure Developer CLI credential."), A = "C:\\Windows";
                return A
            } else return "/bin"
        },
        async getAzdAccessToken(A, q, K) {
            let Y = [];
            if (q) Y = ["--tenant-id", q];
            return new Promise((z, w) => {
                try {
                    Rl5.execFile("azd", ["auth", "token", "--output", "json", ...A.reduce((H, $) => H.concat("--scope", $), []), ...Y], {
                        cwd: Aj7.getSafeWorkingDir(),
                        timeout: K
                    }, (H, $, O) => {
                        z({
                            stdout: $,
                            stderr: O,
                            error: H
                        })
                    })
                } catch (H) {
                    w(H)
                }
            })
        }
    }
})
// @from(Ln 165025, Col 4)
Kj7
// @from(Ln 165026, Col 4)
Yj7 = v(() => {
    Kj7 = {
        execFile(A, q, K) {
            return new Promise((Y, z) => {
                qj7.execFile(A, q, K, (w, H, $) => {
                    if (Buffer.isBuffer(H)) H = H.toString("utf8");
                    if (Buffer.isBuffer($)) $ = $.toString("utf8");
                    if ($ || w) z($ ? Error($) : w);
                    else Y(H)
                })
            })
        }
    }
})
// @from(Ln 165041, Col 0)
function Hj7(A) {
    if (wj7) return `${A}.exe`;
    else return A
}
// @from(Ln 165045, Col 0)
async function zj7(A, q) {
    let K = [];
    for (let Y of A) {
        let [z, ...w] = Y, H = await Kj7.execFile(z, w, {
            encoding: "utf8",
            timeout: q
        });
        K.push(H)
    }
    return K
}
// @from(Ln 165056, Col 0)
class vI1 {
    constructor(A) {
        if (A === null || A === void 0 ? void 0 : A.tenantId) NX(yU, A === null || A === void 0 ? void 0 : A.tenantId), this.tenantId = A === null || A === void 0 ? void 0 : A.tenantId;
        this.additionallyAllowedTenantIds = m$(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), this.timeout = A === null || A === void 0 ? void 0 : A.processTimeoutInMs
    }
    async getAzurePowerShellAccessToken(A, q, K) {
        for (let Y of [...FzA]) {
            try {
                await zj7([
                    [Y, "/?"]
                ], K)
            } catch (H) {
                FzA.shift();
                continue
            }
            let w = (await zj7([
                [Y, "-NoProfile", "-NonInteractive", "-Command", `
          $tenantId = "${q!==null&&q!==void 0?q:""}"
          $m = Import-Module Az.Accounts -MinimumVersion 2.2.0 -PassThru
          $useSecureString = $m.Version -ge [version]'2.17.0'

          $params = @{
            ResourceUrl = "${A}"
          }

          if ($tenantId.Length -gt 0) {
            $params["TenantId"] = $tenantId
          }

          if ($useSecureString) {
            $params["AsSecureString"] = $true
          }

          $token = Get-AzAccessToken @params

          $result = New-Object -TypeName PSObject
          $result | Add-Member -MemberType NoteProperty -Name ExpiresOn -Value $token.ExpiresOn
          if ($useSecureString) {
            $result | Add-Member -MemberType NoteProperty -Name Token -Value (ConvertFrom-SecureString -AsPlainText $token.Token)
          } else {
            $result | Add-Member -MemberType NoteProperty -Name Token -Value $token.Token
          }

          Write-Output (ConvertTo-Json $result)
          `]
            ]))[0];
            return Sl5(w)
        }
        throw Error("Unable to execute PowerShell. Ensure that it is installed in your system")
    }
    async getToken(A, q = {}) {
        return RY.withSpan(`${this.constructor.name}.getToken`, q, async () => {
            let K = rH(this.tenantId, q, this.additionallyAllowedTenantIds),
                Y = typeof A === "string" ? A : A[0];
            if (K) NX(yU, K);
            try {
                EX1(Y, yU), yU.getToken.info(`Using the scope ${Y}`);
                let z = rY6(Y),
                    w = await this.getAzurePowerShellAccessToken(z, K, this.timeout);
                return yU.getToken.info(VX(A)), {
                    token: w.Token,
                    expiresOnTimestamp: new Date(w.ExpiresOn).getTime(),
                    tokenType: "Bearer"
                }
            } catch (z) {
                if (Cl5(z)) {
                    let H = new f4(mzA.installed);
                    throw yU.getToken.info(e9(Y, H)), H
                } else if (yl5(z)) {
                    let H = new f4(mzA.login);
                    throw yU.getToken.info(e9(Y, H)), H
                }
                let w = new f4(`${z}. ${mzA.troubleshoot}`);
                throw yU.getToken.info(e9(Y, w)), w
            }
        })
    }
}
// @from(Ln 165134, Col 0)
async function Sl5(A) {
    let q = /{[^{}]*}/g,
        K = A.match(q),
        Y = A;
    if (K) try {
        for (let z of K) try {
            let w = JSON.parse(z);
            if (w === null || w === void 0 ? void 0 : w.Token) {
                if (Y = Y.replace(z, ""), Y) yU.getToken.warning(Y);
                return w
            }
        } catch (w) {
            continue
        }
    } catch (z) {
        throw Error(`Unable to parse the output of PowerShell. Received output: ${A}`)
    }
    throw Error(`No access token found in the output. Received output: ${A}`)
}
// @from(Ln 165153, Col 4)
yU
// @from(Ln 165153, Col 8)
wj7
// @from(Ln 165153, Col 13)
$j7
// @from(Ln 165153, Col 18)
mzA
// @from(Ln 165153, Col 23)
yl5 = (A) => A.message.match(`(.*)${$j7.login}(.*)`)
// @from(Ln 165154, Col 4)
Cl5 = (A) => A.message.match($j7.installed)
// @from(Ln 165155, Col 4)
FzA
// @from(Ln 165156, Col 4)
QzA = v(() => {
    uD();
    t2();
    gu();
    bD();
    Yj7();
    fM();
    yU = n3("AzurePowerShellCredential"), wj7 = process.platform === "win32";
    $j7 = {
        login: "Run Connect-AzAccount to login",
        installed: "The specified module 'Az.Accounts' with version '2.2.0' was not loaded because no valid module file was found in any module directory"
    }, mzA = {
        login: "Please run 'Connect-AzAccount' from PowerShell to authenticate before using this credential.",
        installed: `The 'Az.Account' module >= 2.2.0 is not installed. Install the Azure Az PowerShell module with: "Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force".`,
        troubleshoot: "To troubleshoot, visit https://aka.ms/azsdk/js/identity/powershellcredential/troubleshoot."
    }, FzA = [Hj7("pwsh")];
    if (wj7) FzA.push(Hj7("powershell"))
})
// @from(Ln 165174, Col 0)
class EI1 {
    constructor(...A) {
        this._sources = [], this._sources = A
    }
    async getToken(A, q = {}) {
        let {
            token: K
        } = await this.getTokenInternal(A, q);
        return K
    }
    async getTokenInternal(A, q = {}) {
        let K = null,
            Y, z = [];
        return RY.withSpan("ChainedTokenCredential.getToken", q, async (w) => {
            for (let H = 0; H < this._sources.length && K === null; H++) try {
                K = await this._sources[H].getToken(A, w), Y = this._sources[H]
            } catch ($) {
                if ($.name === "CredentialUnavailableError" || $.name === "AuthenticationRequiredError") z.push($);
                else throw gzA.getToken.info(e9(A, $)), $
            }
            if (!K && z.length > 0) {
                let H = new ZS1(z, "ChainedTokenCredential authentication failed.");
                throw gzA.getToken.info(e9(A, H)), H
            }
            if (gzA.getToken.info(`Result for ${Y.constructor.name}: ${VX(A)}`), K === null) throw new f4("Failed to retrieve a valid token");
            return {
                token: K,
                successfulCredential: Y
            }
        })
    }
}
// @from(Ln 165206, Col 4)
gzA
// @from(Ln 165207, Col 4)
UzA = v(() => {
    bD();
    t2();
    fM();
    gzA = n3("ChainedTokenCredential")
})
// @from(Ln 165220, Col 0)
class LI1 {
    constructor(A, q, K, Y = {}) {
        if (!A || !q) throw Error(`${kI1}: tenantId and clientId are required parameters.`);
        this.tenantId = A, this.additionallyAllowedTenantIds = m$(Y === null || Y === void 0 ? void 0 : Y.additionallyAllowedTenants), this.sendCertificateChain = Y.sendCertificateChain, this.certificateConfiguration = Object.assign({}, typeof K === "string" ? {
            certificatePath: K
        } : K);
        let z = this.certificateConfiguration.certificate,
            w = this.certificateConfiguration.certificatePath;
        if (!this.certificateConfiguration || !(z || w)) throw Error(`${kI1}: Provide either a PEM certificate in string form, or the path to that certificate in the filesystem. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        if (z && w) throw Error(`${kI1}: To avoid unexpected behaviors, providing both the contents of a PEM certificate and the path to a PEM certificate is forbidden. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        this.msalClient = TW(q, A, Object.assign(Object.assign({}, Y), {
            logger: _j7,
            tokenCredentialOptions: Y
        }))
    }
    async getToken(A, q = {}) {
        return RY.withSpan(`${kI1}.getToken`, q, async (K) => {
            K.tenantId = rH(this.tenantId, K, this.additionallyAllowedTenantIds, _j7);
            let Y = Array.isArray(A) ? A : [A],
                z = await this.buildClientCertificate();
            return this.msalClient.getTokenByClientCertificate(Y, z, K)
        })
    }
    async buildClientCertificate() {
        var A;
        let q = await xl5(this.certificateConfiguration, (A = this.sendCertificateChain) !== null && A !== void 0 ? A : !1),
            K;
        if (this.certificateConfiguration.certificatePassword !== void 0) K = hl5({
            key: q.certificateContents,
            passphrase: this.certificateConfiguration.certificatePassword,
            format: "pem"
        }).export({
            format: "pem",
            type: "pkcs8"
        }).toString();
        else K = q.certificateContents;
        return {
            thumbprint: q.thumbprint,
            thumbprintSha256: q.thumbprintSha256,
            privateKey: K,
            x5c: q.x5c
        }
    }
}
// @from(Ln 165264, Col 0)
async function xl5(A, q) {
    let {
        certificate: K,
        certificatePath: Y
    } = A, z = K || await Il5(Y, "utf8"), w = q ? z : void 0, H = /(-+BEGIN CERTIFICATE-+)(\n\r?|\r\n?)([A-Za-z0-9+/\n\r]+=*)(\n\r?|\r\n?)(-+END CERTIFICATE-+)/g, $ = [], O;
    do
        if (O = H.exec(z), O) $.push(O[3]); while (O);
    if ($.length === 0) throw Error("The file at the specified path does not contain a PEM-encoded certificate.");
    let _ = Oj7("sha1").update(Buffer.from($[0], "base64")).digest("hex").toUpperCase(),
        J = Oj7("sha256").update(Buffer.from($[0], "base64")).digest("hex").toUpperCase();
    return {
        certificateContents: z,
        thumbprintSha256: J,
        thumbprint: _,
        x5c: w
    }
}
// @from(Ln 165281, Col 4)
kI1 = "ClientCertificateCredential"
// @from(Ln 165282, Col 4)
_j7
// @from(Ln 165283, Col 4)
pzA = v(() => {
    kU();
    uD();
    t2();
    fM();
    _j7 = n3(kI1)
})
// @from(Ln 165290, Col 0)
class RI1 {
    constructor(A, q, K, Y = {}) {
        if (!A) throw new f4("ClientSecretCredential: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
        if (!q) throw new f4("ClientSecretCredential: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
        if (!K) throw new f4("ClientSecretCredential: clientSecret is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
        this.clientSecret = K, this.tenantId = A, this.additionallyAllowedTenantIds = m$(Y === null || Y === void 0 ? void 0 : Y.additionallyAllowedTenants), this.msalClient = TW(q, A, Object.assign(Object.assign({}, Y), {
            logger: Jj7,
            tokenCredentialOptions: Y
        }))
    }
    async getToken(A, q = {}) {
        return RY.withSpan(`${this.constructor.name}.getToken`, q, async (K) => {
            K.tenantId = rH(this.tenantId, K, this.additionallyAllowedTenantIds, Jj7);
            let Y = jv(A);
            return this.msalClient.getTokenByClientSecret(Y, this.clientSecret, K)
        })
    }
}
// @from(Ln 165308, Col 4)
Jj7
// @from(Ln 165309, Col 4)
dzA = v(() => {
    kU();
    uD();
    bD();
    t2();
    gu();
    fM();
    Jj7 = n3("ClientSecretCredential")
})
// @from(Ln 165318, Col 0)
class yI1 {
    constructor(A, q, K, Y, z = {}) {
        if (!A) throw new f4("UsernamePasswordCredential: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
        if (!q) throw new f4("UsernamePasswordCredential: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
        if (!K) throw new f4("UsernamePasswordCredential: username is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
        if (!Y) throw new f4("UsernamePasswordCredential: password is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
        this.tenantId = A, this.additionallyAllowedTenantIds = m$(z === null || z === void 0 ? void 0 : z.additionallyAllowedTenants), this.username = K, this.password = Y, this.msalClient = TW(q, this.tenantId, Object.assign(Object.assign({}, z), {
            tokenCredentialOptions: z !== null && z !== void 0 ? z : {}
        }))
    }
    async getToken(A, q = {}) {
        return RY.withSpan(`${this.constructor.name}.getToken`, q, async (K) => {
            K.tenantId = rH(this.tenantId, K, this.additionallyAllowedTenantIds, bl5);
            let Y = jv(A);
            return this.msalClient.getTokenByUsernamePassword(Y, this.username, this.password, K)
        })
    }
}
// @from(Ln 165336, Col 4)
bl5
// @from(Ln 165337, Col 4)
czA = v(() => {
    kU();
    uD();
    bD();
    t2();
    gu();
    fM();
    bl5 = n3("UsernamePasswordCredential")
})
// @from(Ln 165347, Col 0)
function Bl5() {
    var A;
    return ((A = process.env.AZURE_ADDITIONALLY_ALLOWED_TENANTS) !== null && A !== void 0 ? A : "").split(";")
}
// @from(Ln 165352, Col 0)
function ml5() {
    var A;
    let q = ((A = process.env.AZURE_CLIENT_SEND_CERTIFICATE_CHAIN) !== null && A !== void 0 ? A : "").toLowerCase(),
        K = q === "true" || q === "1";
    return CU.verbose(`AZURE_CLIENT_SEND_CERTIFICATE_CHAIN: ${process.env.AZURE_CLIENT_SEND_CERTIFICATE_CHAIN}; sendCertificateChain: ${K}`), K
}
// @from(Ln 165358, Col 0)
class CI1 {
    constructor(A) {
        this._credential = void 0;
        let q = y56(ul5).assigned.join(", ");
        CU.info(`Found the following environment variables: ${q}`);
        let K = process.env.AZURE_TENANT_ID,
            Y = process.env.AZURE_CLIENT_ID,
            z = process.env.AZURE_CLIENT_SECRET,
            w = Bl5(),
            H = ml5(),
            $ = Object.assign(Object.assign({}, A), {
                additionallyAllowedTenantIds: w,
                sendCertificateChain: H
            });
        if (K) NX(CU, K);
        if (K && Y && z) {
            CU.info(`Invoking ClientSecretCredential with tenant ID: ${K}, clientId: ${Y} and clientSecret: [REDACTED]`), this._credential = new RI1(K, Y, z, $);
            return
        }
        let O = process.env.AZURE_CLIENT_CERTIFICATE_PATH,
            _ = process.env.AZURE_CLIENT_CERTIFICATE_PASSWORD;
        if (K && Y && O) {
            CU.info(`Invoking ClientCertificateCredential with tenant ID: ${K}, clientId: ${Y} and certificatePath: ${O}`), this._credential = new LI1(K, Y, {
                certificatePath: O,
                certificatePassword: _
            }, $);
            return
        }
        let J = process.env.AZURE_USERNAME,
            X = process.env.AZURE_PASSWORD;
        if (K && Y && J && X) CU.info(`Invoking UsernamePasswordCredential with tenant ID: ${K}, clientId: ${Y} and username: ${J}`), CU.warning("Environment is configured to use username and password authentication. This authentication method is deprecated, as it doesn't support multifactor authentication (MFA). Use a more secure credential. For more details, see https://aka.ms/azsdk/identity/mfa."), this._credential = new yI1(K, Y, J, X, $)
    }
    async getToken(A, q = {}) {
        return RY.withSpan(`${oY6}.getToken`, q, async (K) => {
            if (this._credential) try {
                let Y = await this._credential.getToken(A, K);
                return CU.getToken.info(VX(A)), Y
            } catch (Y) {
                let z = new ZS(400, {
                    error: `${oY6} authentication failed. To troubleshoot, visit https://aka.ms/azsdk/js/identity/environmentcredential/troubleshoot.`,
                    error_description: Y.message.toString().split("More details:").join("")
                });
                throw CU.getToken.info(e9(A, z)), z
            }
            throw new f4(`${oY6} is unavailable. No underlying credential could be used. To troubleshoot, visit https://aka.ms/azsdk/js/identity/environmentcredential/troubleshoot.`)
        })
    }
}
// @from(Ln 165406, Col 4)
ul5
// @from(Ln 165406, Col 9)
oY6 = "EnvironmentCredential"
// @from(Ln 165407, Col 4)
CU
// @from(Ln 165408, Col 4)
lzA = v(() => {
    bD();
    t2();
    pzA();
    dzA();
    czA();
    uD();
    fM();
    ul5 = ["AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_CLIENT_SECRET", "AZURE_CLIENT_CERTIFICATE_PATH", "AZURE_CLIENT_CERTIFICATE_PASSWORD", "AZURE_USERNAME", "AZURE_PASSWORD", "AZURE_ADDITIONALLY_ALLOWED_TENANTS", "AZURE_CLIENT_SEND_CERTIFICATE_CHAIN"];
    CU = n3(oY6)
})
// @from(Ln 165420, Col 0)
function Fl5(A = {}) {
    var q, K, Y, z;
    (q = A.retryOptions) !== null && q !== void 0 || (A.retryOptions = {
        maxRetries: 5,
        retryDelayInMs: 800
    });
    let w = (K = A === null || A === void 0 ? void 0 : A.managedIdentityClientId) !== null && K !== void 0 ? K : process.env.AZURE_CLIENT_ID,
        H = (Y = A === null || A === void 0 ? void 0 : A.workloadIdentityClientId) !== null && Y !== void 0 ? Y : w,
        $ = A === null || A === void 0 ? void 0 : A.managedIdentityResourceId,
        O = process.env.AZURE_FEDERATED_TOKEN_FILE,
        _ = (z = A === null || A === void 0 ? void 0 : A.tenantId) !== null && z !== void 0 ? z : process.env.AZURE_TENANT_ID;
    if ($) {
        let J = Object.assign(Object.assign({}, A), {
            resourceId: $
        });
        return new Jo(J)
    }
    if (O && H) {
        let J = Object.assign(Object.assign({}, A), {
            tenantId: _
        });
        return new Jo(H, J)
    }
    if (w) {
        let J = Object.assign(Object.assign({}, A), {
            clientId: w
        });
        return new Jo(J)
    }
    return new Jo(A)
}
// @from(Ln 165452, Col 0)
function Ql5(A) {
    var q, K, Y;
    let z = (q = A === null || A === void 0 ? void 0 : A.managedIdentityClientId) !== null && q !== void 0 ? q : process.env.AZURE_CLIENT_ID,
        w = (K = A === null || A === void 0 ? void 0 : A.workloadIdentityClientId) !== null && K !== void 0 ? K : z,
        H = process.env.AZURE_FEDERATED_TOKEN_FILE,
        $ = (Y = A === null || A === void 0 ? void 0 : A.tenantId) !== null && Y !== void 0 ? Y : process.env.AZURE_TENANT_ID;
    if (H && w) {
        let O = Object.assign(Object.assign({}, A), {
            tenantId: $,
            clientId: w,
            tokenFilePath: H
        });
        return new LU(O)
    }
    if ($) {
        let O = Object.assign(Object.assign({}, A), {
            tenantId: $
        });
        return new LU(O)
    }
    return new LU(A)
}
// @from(Ln 165475, Col 0)
function gl5(A = {}) {
    let q = A.processTimeoutInMs;
    return new TI1(Object.assign({
        processTimeoutInMs: q
    }, A))
}
// @from(Ln 165482, Col 0)
function Ul5(A = {}) {
    let q = A.processTimeoutInMs;
    return new NI1(Object.assign({
        processTimeoutInMs: q
    }, A))
}
// @from(Ln 165489, Col 0)
function pl5(A = {}) {
    let q = A.processTimeoutInMs;
    return new vI1(Object.assign({
        processTimeoutInMs: q
    }, A))
}
// @from(Ln 165496, Col 0)
function dl5(A = {}) {
    return new CI1(A)
}
// @from(Ln 165499, Col 0)
class Xj7 {
    constructor(A, q) {
        this.credentialName = A, this.credentialUnavailableErrorMessage = q
    }
    getToken() {
        return izA.getToken.info(`Skipping ${this.credentialName}, reason: ${this.credentialUnavailableErrorMessage}`), Promise.resolve(null)
    }
}
// @from(Ln 165507, Col 4)
izA
// @from(Ln 165507, Col 9)
SI1
// @from(Ln 165508, Col 4)
nzA = v(() => {
    xzA();
    uzA();
    BzA();
    QzA();
    UzA();
    lzA();
    nY6();
    t2();
    izA = n3("DefaultAzureCredential");
    SI1 = class SI1 extends EI1 {
        constructor(A) {
            let q = process.env.AZURE_TOKEN_CREDENTIALS ? process.env.AZURE_TOKEN_CREDENTIALS.trim().toLowerCase() : void 0,
                K = [Ul5, pl5, gl5],
                Y = [dl5, Ql5, Fl5],
                z = [];
            if (q) switch (q) {
                case "dev":
                    z = K;
                    break;
                case "prod":
                    z = Y;
                    break;
                default: {
                    let H = `Invalid value for AZURE_TOKEN_CREDENTIALS = ${process.env.AZURE_TOKEN_CREDENTIALS}. Valid values are 'prod' or 'dev'.`;
                    throw izA.warning(H), Error(H)
                }
            } else z = [...Y, ...K];
            let w = z.map((H) => {
                try {
                    return H(A)
                } catch ($) {
                    return izA.warning(`Skipped ${H.name} because of an error creating the credential: ${$}`), new Xj7(H.name, $.message)
                }
            });
            super(...w)
        }
    }
})
// @from(Ln 165547, Col 0)
class ozA {
    constructor(A) {
        var q, K, Y, z, w;
        this.tenantId = BJ1(rzA, A.tenantId, A.clientId), this.additionallyAllowedTenantIds = m$(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants);
        let H = Object.assign(Object.assign({}, A), {
                tokenCredentialOptions: A,
                logger: rzA
            }),
            $ = A;
        if (this.browserCustomizationOptions = $.browserCustomizationOptions, this.loginHint = $.loginHint, (q = $ === null || $ === void 0 ? void 0 : $.brokerOptions) === null || q === void 0 ? void 0 : q.enabled)
            if (!((K = $ === null || $ === void 0 ? void 0 : $.brokerOptions) === null || K === void 0 ? void 0 : K.parentWindowHandle)) throw Error("In order to do WAM authentication, `parentWindowHandle` under `brokerOptions` is a required parameter");
            else H.brokerOptions = {
                enabled: !0,
                parentWindowHandle: $.brokerOptions.parentWindowHandle,
                legacyEnableMsaPassthrough: (Y = $.brokerOptions) === null || Y === void 0 ? void 0 : Y.legacyEnableMsaPassthrough,
                useDefaultBrokerAccount: (z = $.brokerOptions) === null || z === void 0 ? void 0 : z.useDefaultBrokerAccount
            };
        this.msalClient = TW((w = A.clientId) !== null && w !== void 0 ? w : h71, this.tenantId, H), this.disableAutomaticAuthentication = A === null || A === void 0 ? void 0 : A.disableAutomaticAuthentication
    }
    async getToken(A, q = {}) {
        return RY.withSpan(`${this.constructor.name}.getToken`, q, async (K) => {
            K.tenantId = rH(this.tenantId, K, this.additionallyAllowedTenantIds, rzA);
            let Y = jv(A);
            return this.msalClient.getTokenByInteractiveRequest(Y, Object.assign(Object.assign({}, K), {
                disableAutomaticAuthentication: this.disableAutomaticAuthentication,
                browserCustomizationOptions: this.browserCustomizationOptions,
                loginHint: this.loginHint
            }))
        })
    }
    async authenticate(A, q = {}) {
        return RY.withSpan(`${this.constructor.name}.authenticate`, q, async (K) => {
            let Y = jv(A);
            return await this.msalClient.getTokenByInteractiveRequest(Y, Object.assign(Object.assign({}, K), {
                disableAutomaticAuthentication: !1,
                browserCustomizationOptions: this.browserCustomizationOptions,
                loginHint: this.loginHint
            })), this.msalClient.getActiveAccount()
        })
    }
}
// @from(Ln 165588, Col 4)
rzA
// @from(Ln 165589, Col 4)
Dj7 = v(() => {
    uD();
    t2();
    gu();
    fM();
    kU();
    Tu();
    rzA = n3("InteractiveBrowserCredential")
})
// @from(Ln 165599, Col 0)
function cl5(A) {
    console.log(A.message)
}
// @from(Ln 165602, Col 0)
class szA {
    constructor(A) {
        var q, K;
        this.tenantId = A === null || A === void 0 ? void 0 : A.tenantId, this.additionallyAllowedTenantIds = m$(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants);
        let Y = (q = A === null || A === void 0 ? void 0 : A.clientId) !== null && q !== void 0 ? q : h71,
            z = BJ1(azA, A === null || A === void 0 ? void 0 : A.tenantId, Y);
        this.userPromptCallback = (K = A === null || A === void 0 ? void 0 : A.userPromptCallback) !== null && K !== void 0 ? K : cl5, this.msalClient = TW(Y, z, Object.assign(Object.assign({}, A), {
            logger: azA,
            tokenCredentialOptions: A || {}
        })), this.disableAutomaticAuthentication = A === null || A === void 0 ? void 0 : A.disableAutomaticAuthentication
    }
    async getToken(A, q = {}) {
        return RY.withSpan(`${this.constructor.name}.getToken`, q, async (K) => {
            K.tenantId = rH(this.tenantId, K, this.additionallyAllowedTenantIds, azA);
            let Y = jv(A);
            return this.msalClient.getTokenByDeviceCode(Y, this.userPromptCallback, Object.assign(Object.assign({}, K), {
                disableAutomaticAuthentication: this.disableAutomaticAuthentication
            }))
        })
    }
    async authenticate(A, q = {}) {
        return RY.withSpan(`${this.constructor.name}.authenticate`, q, async (K) => {
            let Y = Array.isArray(A) ? A : [A];
            return await this.msalClient.getTokenByDeviceCode(Y, this.userPromptCallback, Object.assign(Object.assign({}, K), {
                disableAutomaticAuthentication: !1
            })), this.msalClient.getActiveAccount()
        })
    }
}
// @from(Ln 165631, Col 4)
azA
// @from(Ln 165632, Col 4)
jj7 = v(() => {
    uD();
    t2();
    gu();
    fM();
    kU();
    Tu();
    azA = n3("DeviceCodeCredential")
})
// @from(Ln 165641, Col 0)
class tzA {
    constructor(A, q, K, Y, z = {}) {
        var w, H;
        if (!q) throw new f4(`${CS}: is unavailable. clientId is a required parameter.`);
        if (!A) throw new f4(`${CS}: is unavailable. tenantId is a required parameter.`);
        if (!K) throw new f4(`${CS}: is unavailable. serviceConnectionId is a required parameter.`);
        if (!Y) throw new f4(`${CS}: is unavailable. systemAccessToken is a required parameter.`);
        if (z.loggingOptions = Object.assign(Object.assign({}, z === null || z === void 0 ? void 0 : z.loggingOptions), {
                additionalAllowedHeaderNames: [...(H = (w = z.loggingOptions) === null || w === void 0 ? void 0 : w.additionalAllowedHeaderNames) !== null && H !== void 0 ? H : [], "x-vss-e2eid", "x-msedge-ref"]
            }), this.identityClient = new yu(z), NX(bL, A), bL.info(`Invoking AzurePipelinesCredential with tenant ID: ${A}, client ID: ${q}, and service connection ID: ${K}`), !process.env.SYSTEM_OIDCREQUESTURI) throw new f4(`${CS}: is unavailable. Ensure that you're running this task in an Azure Pipeline, so that following missing system variable(s) can be defined- "SYSTEM_OIDCREQUESTURI"`);
        let $ = `${process.env.SYSTEM_OIDCREQUESTURI}?api-version=${ll5}&serviceConnectionId=${K}`;
        bL.info(`Invoking ClientAssertionCredential with tenant ID: ${A}, client ID: ${q} and service connection ID: ${K}`), this.clientAssertionCredential = new U41(A, q, this.requestOidcToken.bind(this, $, Y), z)
    }
    async getToken(A, q) {
        if (!this.clientAssertionCredential) {
            let K = `${CS}: is unavailable. To use Federation Identity in Azure Pipelines, the following parameters are required - 
      tenantId,
      clientId,
      serviceConnectionId,
      systemAccessToken,
      "SYSTEM_OIDCREQUESTURI".      
      See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/azurepipelinescredential/troubleshoot`;
            throw bL.error(K), new f4(K)
        }
        return bL.info("Invoking getToken() of Client Assertion Credential"), this.clientAssertionCredential.getToken(A, q)
    }
    async requestOidcToken(A, q) {
        bL.info("Requesting OIDC token from Azure Pipelines..."), bL.info(A);
        let K = $v({
                url: A,
                method: "POST",
                headers: zU({
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${q}`,
                    "X-TFS-FedAuthRedirect": "Suppress"
                })
            }),
            Y = await this.identityClient.sendRequest(K);
        return il5(Y)
    }
}
// @from(Ln 165683, Col 0)
function il5(A) {
    let q = A.bodyAsText;
    if (!q) throw bL.error(`${CS}: Authentication Failed. Received null token from OIDC request. Response status- ${A.status}. Complete response - ${JSON.stringify(A)}`), new ZS(A.status, {
        error: `${CS}: Authentication Failed. Received null token from OIDC request.`,
        error_description: `${JSON.stringify(A)}. See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/azurepipelinescredential/troubleshoot`
    });
    try {
        let K = JSON.parse(q);
        if (K === null || K === void 0 ? void 0 : K.oidcToken) return K.oidcToken;
        else {
            let Y = `${CS}: Authentication Failed. oidcToken field not detected in the response.`,
                z = "";
            if (A.status !== 200) z = `Response body = ${q}. Response Headers ["x-vss-e2eid"] = ${A.headers.get("x-vss-e2eid")} and ["x-msedge-ref"] = ${A.headers.get("x-msedge-ref")}. See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/azurepipelinescredential/troubleshoot`;
            throw bL.error(Y), bL.error(z), new ZS(A.status, {
                error: Y,
                error_description: z
            })
        }
    } catch (K) {
        let Y = `${CS}: Authentication Failed. oidcToken field not detected in the response.`;
        throw bL.error(`Response from service = ${q}, Response Headers ["x-vss-e2eid"] = ${A.headers.get("x-vss-e2eid")} 
      and ["x-msedge-ref"] = ${A.headers.get("x-msedge-ref")}, error message = ${K.message}`), bL.error(Y), new ZS(A.status, {
            error: Y,
            error_description: `Response = ${q}. Response headers ["x-vss-e2eid"] = ${A.headers.get("x-vss-e2eid")} and ["x-msedge-ref"] =  ${A.headers.get("x-msedge-ref")}. See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/azurepipelinescredential/troubleshoot`
        })
    }
}
// @from(Ln 165710, Col 4)
CS = "AzurePipelinesCredential"
// @from(Ln 165711, Col 4)
bL
// @from(Ln 165711, Col 8)
ll5 = "7.1"
// @from(Ln 165712, Col 4)
Mj7 = v(() => {
    bD();
    Lu();
    iY6();
    mS1();
    uD();
    t2();
    bL = n3(CS)
})
// @from(Ln 165721, Col 0)
class ezA {
    constructor(A, q, K, Y, z, w) {
        if (NX(Pj7, A), this.clientSecret = K, typeof z === "string") this.authorizationCode = Y, this.redirectUri = z;
        else this.authorizationCode = K, this.redirectUri = Y, this.clientSecret = void 0, w = z;
        this.tenantId = A, this.additionallyAllowedTenantIds = m$(w === null || w === void 0 ? void 0 : w.additionallyAllowedTenants), this.msalClient = TW(q, A, Object.assign(Object.assign({}, w), {
            logger: Pj7,
            tokenCredentialOptions: w !== null && w !== void 0 ? w : {}
        }))
    }
    async getToken(A, q = {}) {
        return RY.withSpan(`${this.constructor.name}.getToken`, q, async (K) => {
            let Y = rH(this.tenantId, K, this.additionallyAllowedTenantIds);
            K.tenantId = Y;
            let z = jv(A);
            return this.msalClient.getTokenByAuthorizationCode(z, this.redirectUri, this.authorizationCode, this.clientSecret, Object.assign(Object.assign({}, K), {
                disableAutomaticAuthentication: this.disableAutomaticAuthentication
            }))
        })
    }
}
// @from(Ln 165741, Col 4)
Pj7
// @from(Ln 165742, Col 4)
Wj7 = v(() => {
    uD();
    uD();
    t2();
    gu();
    fM();
    kU();
    Pj7 = n3("AuthorizationCodeCredential")
})
// @from(Ln 165757, Col 0)
class q2A {
    constructor(A) {
        let {
            clientSecret: q
        } = A, {
            certificatePath: K,
            sendCertificateChain: Y
        } = A, {
            getAssertion: z
        } = A, {
            tenantId: w,
            clientId: H,
            userAssertionToken: $,
            additionallyAllowedTenants: O
        } = A;
        if (!w) throw new f4(`${kX1}: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        if (!H) throw new f4(`${kX1}: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        if (!q && !K && !z) throw new f4(`${kX1}: You must provide one of clientSecret, certificatePath, or a getAssertion callback but none were provided. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        if (!$) throw new f4(`${kX1}: userAssertionToken is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        this.certificatePath = K, this.clientSecret = q, this.userAssertionToken = $, this.sendCertificateChain = Y, this.clientAssertion = z, this.tenantId = w, this.additionallyAllowedTenantIds = m$(O), this.msalClient = TW(H, this.tenantId, Object.assign(Object.assign({}, A), {
            logger: A2A,
            tokenCredentialOptions: A
        }))
    }
    async getToken(A, q = {}) {
        return RY.withSpan(`${kX1}.getToken`, q, async (K) => {
            K.tenantId = rH(this.tenantId, K, this.additionallyAllowedTenantIds, A2A);
            let Y = jv(A);
            if (this.certificatePath) {
                let z = await this.buildClientCertificate(this.certificatePath);
                return this.msalClient.getTokenOnBehalfOf(Y, this.userAssertionToken, z, K)
            } else if (this.clientSecret) return this.msalClient.getTokenOnBehalfOf(Y, this.userAssertionToken, this.clientSecret, q);
            else if (this.clientAssertion) return this.msalClient.getTokenOnBehalfOf(Y, this.userAssertionToken, this.clientAssertion, q);
            else throw Error("Expected either clientSecret or certificatePath or clientAssertion to be defined.")
        })
    }
    async buildClientCertificate(A) {
        try {
            let q = await this.parseCertificate({
                certificatePath: A
            }, this.sendCertificateChain);
            return {
                thumbprint: q.thumbprint,
                thumbprintSha256: q.thumbprintSha256,
                privateKey: q.certificateContents,
                x5c: q.x5c
            }
        } catch (q) {
            throw A2A.info(e9("", q)), q
        }
    }
    async parseCertificate(A, q) {
        let K = A.certificatePath,
            Y = await nl5(K, "utf8"),
            z = q ? Y : void 0,
            w = /(-+BEGIN CERTIFICATE-+)(\n\r?|\r\n?)([A-Za-z0-9+/\n\r]+=*)(\n\r?|\r\n?)(-+END CERTIFICATE-+)/g,
            H = [],
            $;
        do
            if ($ = w.exec(Y), $) H.push($[3]); while ($);
        if (H.length === 0) throw Error("The file at the specified path does not contain a PEM-encoded certificate.");
        let O = Gj7("sha1").update(Buffer.from(H[0], "base64")).digest("hex").toUpperCase(),
            _ = Gj7("sha256").update(Buffer.from(H[0], "base64")).digest("hex").toUpperCase();
        return {
            certificateContents: Y,
            thumbprintSha256: _,
            thumbprint: O,
            x5c: z
        }
    }
}
// @from(Ln 165828, Col 4)
kX1 = "OnBehalfOfCredential"
// @from(Ln 165829, Col 4)
A2A
// @from(Ln 165830, Col 4)
Zj7 = v(() => {
    kU();
    t2();
    uD();
    bD();
    gu();
    fM();
    A2A = n3(kX1)
})
// @from(Ln 165840, Col 0)
function fj7(A, q, K) {
    let {
        abortSignal: Y,
        tracingOptions: z
    } = K || {}, w = RS1();
    w.addPolicy(xS1({
        credential: A,
        scopes: q
    }));
    async function H() {
        var $;
        let _ = ($ = (await w.sendRequest({
            sendRequest: (J) => Promise.resolve({
                request: J,
                status: 200,
                headers: J.headers
            })
        }, $v({
            url: "https://example.com",
            abortSignal: Y,
            tracingOptions: z
        }))).headers.get("authorization")) === null || $ === void 0 ? void 0 : $.split(" ")[1];
        if (!_) throw Error("Failed to get access token");
        return _
    }
    return H
}
// @from(Ln 165867, Col 4)
Vj7 = v(() => {
    Lu()
})
// @from(Ln 165870, Col 4)
Nj7 = {}
// @from(Ln 165906, Col 0)
function rl5() {
    return new SI1
}
// @from(Ln 165909, Col 4)
Tj7 = v(() => {
    nzA();
    bD();
    dY6();
    UzA();
    dzA();
    nzA();
    lzA();
    pzA();
    iY6();
    uzA();
    BzA();
    Dj7();
    xzA();
    jj7();
    Mj7();
    Wj7();
    QzA();
    czA();
    I5A();
    Zj7();
    nY6();
    t2();
    Tu();
    Vj7();
    M$7()
})
// @from(Ln 165936, Col 4)
K2A = R((td2, Sj7) => {
    var aY6 = Object.prototype.hasOwnProperty,
        Cj7 = Object.prototype.toString,
        vj7 = Object.defineProperty,
        Ej7 = Object.getOwnPropertyDescriptor,
        kj7 = function(q) {
            if (typeof Array.isArray === "function") return Array.isArray(q);
            return Cj7.call(q) === "[object Array]"
        },
        Lj7 = function(q) {
            if (!q || Cj7.call(q) !== "[object Object]") return !1;
            var K = aY6.call(q, "constructor"),
                Y = q.constructor && q.constructor.prototype && aY6.call(q.constructor.prototype, "isPrototypeOf");
            if (q.constructor && !K && !Y) return !1;
            var z;
            for (z in q);
            return typeof z > "u" || aY6.call(q, z)
        },
        Rj7 = function(q, K) {
            if (vj7 && K.name === "__proto__") vj7(q, K.name, {
                enumerable: !0,
                configurable: !0,
                value: K.newValue,
                writable: !0
            });
            else q[K.name] = K.newValue
        },
        yj7 = function(q, K) {
            if (K === "__proto__") {
                if (!aY6.call(q, K)) return;
                else if (Ej7) return Ej7(q, K).value
            }
            return q[K]
        };
    Sj7.exports = function A() {
        var q, K, Y, z, w, H, $ = arguments[0],
            O = 1,
            _ = arguments.length,
            J = !1;
        if (typeof $ === "boolean") J = $, $ = arguments[1] || {}, O = 2;
        if ($ == null || typeof $ !== "object" && typeof $ !== "function") $ = {};
        for (; O < _; ++O)
            if (q = arguments[O], q != null) {
                for (K in q)
                    if (Y = yj7($, K), z = yj7(q, K), $ !== z) {
                        if (J && z && (Lj7(z) || (w = kj7(z)))) {
                            if (w) w = !1, H = Y && kj7(Y) ? Y : [];
                            else H = Y && Lj7(Y) ? Y : {};
                            Rj7($, {
                                name: K,
                                newValue: A(J, H, z)
                            })
                        } else if (typeof z < "u") Rj7($, {
                            name: K,
                            newValue: z
                        })
                    }
            } return $
    }
})
// @from(Ln 165996, Col 4)
tY6 = R((bj7) => {
    function qw(A, q, K) {
        if (K.globals) A = K.globals[A.name];
        return new A(`${K.context?K.context:"Value"} ${q}.`)
    }

    function yX1(A, q) {
        if (typeof A === "bigint") throw qw(TypeError, "is a BigInt which cannot be converted to a number", q);
        if (!q.globals) return Number(A);
        return q.globals.Number(A)
    }

    function Ij7(A) {
        if (A > 0 && A % 1 === 0.5 && (A & 1) === 0 || A < 0 && A % 1 === -0.5 && (A & 1) === 1) return hI1(Math.floor(A));
        return hI1(Math.round(A))
    }

    function sY6(A) {
        return hI1(Math.trunc(A))
    }

    function hj7(A) {
        return A < 0 ? -1 : 1
    }

    function ol5(A, q) {
        let K = A % q;
        if (hj7(q) !== hj7(K)) return K + q;
        return K
    }

    function hI1(A) {
        return A === 0 ? 0 : A
    }

    function CX1(A, {
        unsigned: q
    }) {
        let K, Y;
        if (q) K = 0, Y = 2 ** A - 1;
        else K = -(2 ** (A - 1)), Y = 2 ** (A - 1) - 1;
        let z = 2 ** A,
            w = 2 ** (A - 1);
        return (H, $ = {}) => {
            let O = yX1(H, $);
            if (O = hI1(O), $.enforceRange) {
                if (!Number.isFinite(O)) throw qw(TypeError, "is not a finite number", $);
                if (O = sY6(O), O < K || O > Y) throw qw(TypeError, `is outside the accepted range of ${K} to ${Y}, inclusive`, $);
                return O
            }
            if (!Number.isNaN(O) && $.clamp) return O = Math.min(Math.max(O, K), Y), O = Ij7(O), O;
            if (!Number.isFinite(O) || O === 0) return 0;
            if (O = sY6(O), O >= K && O <= Y) return O;
            if (O = ol5(O, z), !q && O >= w) return O - z;
            return O
        }
    }

    function xj7(A, {
        unsigned: q
    }) {
        let K = Number.MAX_SAFE_INTEGER,
            Y = q ? 0 : Number.MIN_SAFE_INTEGER,
            z = q ? BigInt.asUintN : BigInt.asIntN;
        return (w, H = {}) => {
            let $ = yX1(w, H);
            if ($ = hI1($), H.enforceRange) {
                if (!Number.isFinite($)) throw qw(TypeError, "is not a finite number", H);
                if ($ = sY6($), $ < Y || $ > K) throw qw(TypeError, `is outside the accepted range of ${Y} to ${K}, inclusive`, H);
                return $
            }
            if (!Number.isNaN($) && H.clamp) return $ = Math.min(Math.max($, Y), K), $ = Ij7($), $;
            if (!Number.isFinite($) || $ === 0) return 0;
            let O = BigInt(sY6($));
            return O = z(A, O), Number(O)
        }
    }
    bj7.any = (A) => {
        return A
    };
    bj7.undefined = () => {
        return
    };
    bj7.boolean = (A) => {
        return Boolean(A)
    };
    bj7.byte = CX1(8, {
        unsigned: !1
    });
    bj7.octet = CX1(8, {
        unsigned: !0
    });
    bj7.short = CX1(16, {
        unsigned: !1
    });
    bj7["unsigned short"] = CX1(16, {
        unsigned: !0
    });
    bj7.long = CX1(32, {
        unsigned: !1
    });
    bj7["unsigned long"] = CX1(32, {
        unsigned: !0
    });
    bj7["long long"] = xj7(64, {
        unsigned: !1
    });
    bj7["unsigned long long"] = xj7(64, {
        unsigned: !0
    });
    bj7.double = (A, q = {}) => {
        let K = yX1(A, q);
        if (!Number.isFinite(K)) throw qw(TypeError, "is not a finite floating-point value", q);
        return K
    };
    bj7["unrestricted double"] = (A, q = {}) => {
        return yX1(A, q)
    };
    bj7.float = (A, q = {}) => {
        let K = yX1(A, q);
        if (!Number.isFinite(K)) throw qw(TypeError, "is not a finite floating-point value", q);
        if (Object.is(K, -0)) return K;
        let Y = Math.fround(K);
        if (!Number.isFinite(Y)) throw qw(TypeError, "is outside the range of a single-precision floating-point value", q);
        return Y
    };
    bj7["unrestricted float"] = (A, q = {}) => {
        let K = yX1(A, q);
        if (isNaN(K)) return K;
        if (Object.is(K, -0)) return K;
        return Math.fround(K)
    };
    bj7.DOMString = (A, q = {}) => {
        if (q.treatNullAsEmptyString && A === null) return "";
        if (typeof A === "symbol") throw qw(TypeError, "is a symbol, which cannot be converted to a string", q);
        return (q.globals ? q.globals.String : String)(A)
    };
    bj7.ByteString = (A, q = {}) => {
        let K = bj7.DOMString(A, q),
            Y;
        for (let z = 0;
            (Y = K.codePointAt(z)) !== void 0; ++z)
            if (Y > 255) throw qw(TypeError, "is not a valid ByteString", q);
        return K
    };
    bj7.USVString = (A, q = {}) => {
        let K = bj7.DOMString(A, q),
            Y = K.length,
            z = [];
        for (let w = 0; w < Y; ++w) {
            let H = K.charCodeAt(w);
            if (H < 55296 || H > 57343) z.push(String.fromCodePoint(H));
            else if (56320 <= H && H <= 57343) z.push(String.fromCodePoint(65533));
            else if (w === Y - 1) z.push(String.fromCodePoint(65533));
            else {
                let $ = K.charCodeAt(w + 1);
                if (56320 <= $ && $ <= 57343) {
                    let O = H & 1023,
                        _ = $ & 1023;
                    z.push(String.fromCodePoint(65536 + 1024 * O + _)), ++w
                } else z.push(String.fromCodePoint(65533))
            }
        }
        return z.join("")
    };
    bj7.object = (A, q = {}) => {
        if (A === null || typeof A !== "object" && typeof A !== "function") throw qw(TypeError, "is not an object", q);
        return A
    };
    var al5 = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get,
        sl5 = typeof SharedArrayBuffer === "function" ? Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, "byteLength").get : null;

    function Y2A(A) {
        try {
            return al5.call(A), !0
        } catch {
            return !1
        }
    }

    function LX1(A) {
        try {
            return sl5.call(A), !0
        } catch {
            return !1
        }
    }

    function RX1(A) {
        try {
            return new Uint8Array(A), !1
        } catch {
            return !0
        }
    }
    bj7.ArrayBuffer = (A, q = {}) => {
        if (!Y2A(A)) {
            if (q.allowShared && !LX1(A)) throw qw(TypeError, "is not an ArrayBuffer or SharedArrayBuffer", q);
            throw qw(TypeError, "is not an ArrayBuffer", q)
        }
        if (RX1(A)) throw qw(TypeError, "is a detached ArrayBuffer", q);
        return A
    };
    var tl5 = Object.getOwnPropertyDescriptor(DataView.prototype, "byteLength").get;
    bj7.DataView = (A, q = {}) => {
        try {
            tl5.call(A)
        } catch (K) {
            throw qw(TypeError, "is not a DataView", q)
        }
        if (!q.allowShared && LX1(A.buffer)) throw qw(TypeError, "is backed by a SharedArrayBuffer, which is not allowed", q);
        if (RX1(A.buffer)) throw qw(TypeError, "is backed by a detached ArrayBuffer", q);
        return A
    };
    var el5 = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array).prototype, Symbol.toStringTag).get;
    [Int8Array, Int16Array, Int32Array, Uint8Array, Uint16Array, Uint32Array, Uint8ClampedArray, Float32Array, Float64Array].forEach((A) => {
        let {
            name: q
        } = A, K = /^[AEIOU]/u.test(q) ? "an" : "a";
        bj7[q] = (Y, z = {}) => {
            if (!ArrayBuffer.isView(Y) || el5.call(Y) !== q) throw qw(TypeError, `is not ${K} ${q} object`, z);
            if (!z.allowShared && LX1(Y.buffer)) throw qw(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", z);
            if (RX1(Y.buffer)) throw qw(TypeError, "is a view on a detached ArrayBuffer", z);
            return Y
        }
    });
    bj7.ArrayBufferView = (A, q = {}) => {
        if (!ArrayBuffer.isView(A)) throw qw(TypeError, "is not a view on an ArrayBuffer or SharedArrayBuffer", q);
        if (!q.allowShared && LX1(A.buffer)) throw qw(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", q);
        if (RX1(A.buffer)) throw qw(TypeError, "is a view on a detached ArrayBuffer", q);
        return A
    };
    bj7.BufferSource = (A, q = {}) => {
        if (ArrayBuffer.isView(A)) {
            if (!q.allowShared && LX1(A.buffer)) throw qw(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", q);
            if (RX1(A.buffer)) throw qw(TypeError, "is a view on a detached ArrayBuffer", q);
            return A
        }
        if (!q.allowShared && !Y2A(A)) throw qw(TypeError, "is not an ArrayBuffer or a view on one", q);
        if (q.allowShared && !LX1(A) && !Y2A(A)) throw qw(TypeError, "is not an ArrayBuffer, SharedArrayBuffer, or a view on one", q);
        if (RX1(A)) throw qw(TypeError, "is a detached ArrayBuffer", q);
        return A
    };
    bj7.DOMTimeStamp = bj7["unsigned long long"]
})
// @from(Ln 166241, Col 4)
Az6 = R((pj7, dj7) => {
    function Ti5(A) {
        return typeof A === "object" && A !== null || typeof A === "function"
    }
    var Bj7 = Function.prototype.call.bind(Object.prototype.hasOwnProperty);

    function vi5(A, q) {
        for (let K of Reflect.ownKeys(q)) {
            let Y = Reflect.getOwnPropertyDescriptor(q, K);
            if (Y && !Reflect.defineProperty(A, K, Y)) throw TypeError(`Cannot redefine property: ${String(K)}`)
        }
    }

    function Ei5(A, q) {
        let K = Qj7(A);
        return Object.defineProperties(Object.create(K["%Object.prototype%"]), Object.getOwnPropertyDescriptors(q))
    }
    var mj7 = Symbol("wrapper"),
        Fj7 = Symbol("impl"),
        SX1 = Symbol("SameObject caches"),
        eY6 = Symbol.for("[webidl2js] constructor registry"),
        ki5 = Object.getPrototypeOf(Object.getPrototypeOf(async function*() {}).prototype);

    function Qj7(A) {
        if (Bj7(A, eY6)) return A[eY6];
        let q = Object.create(null);
        q["%Object.prototype%"] = A.Object.prototype, q["%IteratorPrototype%"] = Object.getPrototypeOf(Object.getPrototypeOf(new A.Array()[Symbol.iterator]()));
        try {
            q["%AsyncIteratorPrototype%"] = Object.getPrototypeOf(Object.getPrototypeOf(A.eval("(async function* () {})").prototype))
        } catch {
            q["%AsyncIteratorPrototype%"] = ki5
        }
        return A[eY6] = q, q
    }

    function Li5(A, q, K) {
        if (!A[SX1]) A[SX1] = Object.create(null);
        if (q in A[SX1]) return A[SX1][q];
        return A[SX1][q] = K(), A[SX1][q]
    }

    function gj7(A) {
        return A ? A[mj7] : null
    }

    function Uj7(A) {
        return A ? A[Fj7] : null
    }

    function Ri5(A) {
        let q = gj7(A);
        return q ? q : A
    }

    function yi5(A) {
        let q = Uj7(A);
        return q ? q : A
    }
    var Ci5 = Symbol("internal");

    function Si5(A) {
        if (typeof A !== "string") return !1;
        let q = A >>> 0;
        if (q === 4294967295) return !1;
        let K = `${q}`;
        if (A !== K) return !1;
        return !0
    }
    var hi5 = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get;

    function Ii5(A) {
        try {
            return hi5.call(A), !0
        } catch (q) {
            return !1
        }
    }

    function xi5([A, q], K) {
        let Y;
        switch (K) {
            case "key":
                Y = A;
                break;
            case "value":
                Y = q;
                break;
            case "key+value":
                Y = [A, q];
                break
        }
        return {
            value: Y,
            done: !1
        }
    }
    var bi5 = Symbol("supports property index"),
        ui5 = Symbol("supported property indices"),
        Bi5 = Symbol("supports property name"),
        mi5 = Symbol("supported property names"),
        Fi5 = Symbol("indexed property get"),
        Qi5 = Symbol("indexed property set new"),
        gi5 = Symbol("indexed property set existing"),
        Ui5 = Symbol("named property get"),
        pi5 = Symbol("named property set new"),
        di5 = Symbol("named property set existing"),
        ci5 = Symbol("named property delete"),
        li5 = Symbol("async iterator get the next iteration result"),
        ii5 = Symbol("async iterator return steps"),
        ni5 = Symbol("async iterator initialization steps"),
        ri5 = Symbol("async iterator end of iteration");
    dj7.exports = pj7 = {
        isObject: Ti5,
        hasOwn: Bj7,
        define: vi5,
        newObjectInRealm: Ei5,
        wrapperSymbol: mj7,
        implSymbol: Fj7,
        getSameObject: Li5,
        ctorRegistrySymbol: eY6,
        initCtorRegistry: Qj7,
        wrapperForImpl: gj7,
        implForWrapper: Uj7,
        tryWrapperForImpl: Ri5,
        tryImplForWrapper: yi5,
        iterInternalSymbol: Ci5,
        isArrayBuffer: Ii5,
        isArrayIndexPropName: Si5,
        supportsPropertyIndex: bi5,
        supportedPropertyIndices: ui5,
        supportsPropertyName: Bi5,
        supportedPropertyNames: mi5,
        indexedGet: Fi5,
        indexedSetNew: Qi5,
        indexedSetExisting: gi5,
        namedGet: Ui5,
        namedSetNew: pi5,
        namedSetExisting: di5,
        namedDelete: ci5,
        asyncIteratorNext: li5,
        asyncIteratorReturn: ii5,
        asyncIteratorInit: ni5,
        asyncIteratorEOI: ri5,
        iteratorResult: xi5
    }
})
// @from(Ln 166387, Col 4)
sj7 = R((Ac2, aj7) => {
    var oi5 = /^xn--/,
        ai5 = /[^\0-\x7F]/,
        si5 = /[\x2E\u3002\uFF0E\uFF61]/g,
        ti5 = {
            overflow: "Overflow: input needs wider integers to process",
            "not-basic": "Illegal input >= 0x80 (not a basic code point)",
            "invalid-input": "Invalid input"
        },
        Uu = Math.floor,
        w2A = String.fromCharCode;

    function Xo(A) {
        throw RangeError(ti5[A])
    }

    function ei5(A, q) {
        let K = [],
            Y = A.length;
        while (Y--) K[Y] = q(A[Y]);
        return K
    }

    function lj7(A, q) {
        let K = A.split("@"),
            Y = "";
        if (K.length > 1) Y = K[0] + "@", A = K[1];
        A = A.replace(si5, ".");
        let z = A.split("."),
            w = ei5(z, q).join(".");
        return Y + w
    }

    function ij7(A) {
        let q = [],
            K = 0,
            Y = A.length;
        while (K < Y) {
            let z = A.charCodeAt(K++);
            if (z >= 55296 && z <= 56319 && K < Y) {
                let w = A.charCodeAt(K++);
                if ((w & 64512) == 56320) q.push(((z & 1023) << 10) + (w & 1023) + 65536);
                else q.push(z), K--
            } else q.push(z)
        }
        return q
    }
    var An5 = (A) => String.fromCodePoint(...A),
        qn5 = function(A) {
            if (A >= 48 && A < 58) return 26 + (A - 48);
            if (A >= 65 && A < 91) return A - 65;
            if (A >= 97 && A < 123) return A - 97;
            return 36
        },
        cj7 = function(A, q) {
            return A + 22 + 75 * (A < 26) - ((q != 0) << 5)
        },
        nj7 = function(A, q, K) {
            let Y = 0;
            A = K ? Uu(A / 700) : A >> 1, A += Uu(A / q);
            for (; A > 455; Y += 36) A = Uu(A / 35);
            return Uu(Y + 36 * A / (A + 38))
        },
        rj7 = function(A) {
            let q = [],
                K = A.length,
                Y = 0,
                z = 128,
                w = 72,
                H = A.lastIndexOf("-");
            if (H < 0) H = 0;
            for (let $ = 0; $ < H; ++$) {
                if (A.charCodeAt($) >= 128) Xo("not-basic");
                q.push(A.charCodeAt($))
            }
            for (let $ = H > 0 ? H + 1 : 0; $ < K;) {
                let O = Y;
                for (let J = 1, X = 36;; X += 36) {
                    if ($ >= K) Xo("invalid-input");
                    let D = qn5(A.charCodeAt($++));
                    if (D >= 36) Xo("invalid-input");
                    if (D > Uu((2147483647 - Y) / J)) Xo("overflow");
                    Y += D * J;
                    let j = X <= w ? 1 : X >= w + 26 ? 26 : X - w;
                    if (D < j) break;
                    let M = 36 - j;
                    if (J > Uu(2147483647 / M)) Xo("overflow");
                    J *= M
                }
                let _ = q.length + 1;
                if (w = nj7(Y - O, _, O == 0), Uu(Y / _) > 2147483647 - z) Xo("overflow");
                z += Uu(Y / _), Y %= _, q.splice(Y++, 0, z)
            }
            return String.fromCodePoint(...q)
        },
        oj7 = function(A) {
            let q = [];
            A = ij7(A);
            let K = A.length,
                Y = 128,
                z = 0,
                w = 72;
            for (let O of A)
                if (O < 128) q.push(w2A(O));
            let H = q.length,
                $ = H;
            if (H) q.push("-");
            while ($ < K) {
                let O = 2147483647;
                for (let J of A)
                    if (J >= Y && J < O) O = J;
                let _ = $ + 1;
                if (O - Y > Uu((2147483647 - z) / _)) Xo("overflow");
                z += (O - Y) * _, Y = O;
                for (let J of A) {
                    if (J < Y && ++z > 2147483647) Xo("overflow");
                    if (J === Y) {
                        let X = z;
                        for (let D = 36;; D += 36) {
                            let j = D <= w ? 1 : D >= w + 26 ? 26 : D - w;
                            if (X < j) break;
                            let M = X - j,
                                P = 36 - j;
                            q.push(w2A(cj7(j + M % P, 0))), X = Uu(M / P)
                        }
                        q.push(w2A(cj7(X, 0))), w = nj7(z, _, $ === H), z = 0, ++$
                    }
                }++z, ++Y
            }
            return q.join("")
        },
        Kn5 = function(A) {
            return lj7(A, function(q) {
                return oi5.test(q) ? rj7(q.slice(4).toLowerCase()) : q
            })
        },
        Yn5 = function(A) {
            return lj7(A, function(q) {
                return ai5.test(q) ? "xn--" + oj7(q) : q
            })
        },
        zn5 = {
            version: "2.3.1",
            ucs2: {
                decode: ij7,
                encode: An5
            },
            decode: rj7,
            encode: oj7,
            toASCII: Yn5,
            toUnicode: Kn5
        };
    aj7.exports = zn5
})