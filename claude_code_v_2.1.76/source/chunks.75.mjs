
// @from(Ln 189789, Col 0)
class Md {
    constructor(A) {
        this.azureFederatedTokenFileContent = void 0, this.cacheDate = void 0;
        let q = Aj1(Ij9).assigned.join(", ");
        Wg6.info(`Found the following environment variables: ${q}`);
        let K = A !== null && A !== void 0 ? A : {},
            Y = K.tenantId || process.env.AZURE_TENANT_ID,
            z = K.clientId || process.env.AZURE_CLIENT_ID;
        if (this.federatedTokenFilePath = K.tokenFilePath || process.env.AZURE_FEDERATED_TOKEN_FILE, Y) dJ(Wg6, Y);
        if (!z) throw new D4(`${o56}: is unavailable. clientId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_CLIENT_ID".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
        if (!Y) throw new D4(`${o56}: is unavailable. tenantId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_TENANT_ID".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
        if (!this.federatedTokenFilePath) throw new D4(`${o56}: is unavailable. federatedTokenFilePath is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_FEDERATED_TOKEN_FILE".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
        Wg6.info(`Invoking ClientAssertionCredential with tenant ID: ${Y}, clientId: ${K.clientId} and federated token path: [REDACTED]`), this.client = new r56(Y, z, this.readFileContents.bind(this), A)
    }
    async getToken(A, q) {
        if (!this.client) {
            let K = `${o56}: is unavailable. tenantId, clientId, and federatedTokenFilePath are required parameters. 
      In DefaultAzureCredential and ManagedIdentityCredential, these can be provided as environment variables - 
      "AZURE_TENANT_ID",
      "AZURE_CLIENT_ID",
      "AZURE_FEDERATED_TOKEN_FILE". See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`;
            throw Wg6.info(K), new D4(K)
        }
        return Wg6.info("Invoking getToken() of Client Assertion Credential"), this.client.getToken(A, q)
    }
    async readFileContents() {
        if (this.cacheDate !== void 0 && Date.now() - this.cacheDate >= 300000) this.azureFederatedTokenFileContent = void 0;
        if (!this.federatedTokenFilePath) throw new D4(`${o56}: is unavailable. Invalid file path provided ${this.federatedTokenFilePath}.`);
        if (!this.azureFederatedTokenFileContent) {
            let q = (await Cj9(this.federatedTokenFilePath, "utf8")).trim();
            if (!q) throw new D4(`${o56}: is unavailable. No content on the file ${this.federatedTokenFilePath}.`);
            else this.azureFederatedTokenFileContent = q, this.cacheDate = Date.now()
        }
        return this.azureFederatedTokenFileContent
    }
}
// @from(Ln 189828, Col 4)
o56 = "WorkloadIdentityCredential"
// @from(Ln 189829, Col 4)
Ij9
// @from(Ln 189829, Col 9)
Wg6
// @from(Ln 189830, Col 4)
fM1 = E(() => {
    H2();
    GM1();
    pM();
    QM();
    Ij9 = ["AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_FEDERATED_TOKEN_FILE"], Wg6 = h5(o56)
})
// @from(Ln 189837, Col 4)
Xn7 = "ManagedIdentityCredential - Token Exchange"
// @from(Ln 189838, Col 4)
bj9
// @from(Ln 189838, Col 9)
CW8
// @from(Ln 189839, Col 4)
Pn7 = E(() => {
    fM1();
    H2();
    bj9 = h5(Xn7), CW8 = {
        name: "tokenExchangeMsi",
        async isAvailable(A) {
            let q = process.env,
                K = Boolean((A || q.AZURE_CLIENT_ID) && q.AZURE_TENANT_ID && process.env.AZURE_FEDERATED_TOKEN_FILE);
            if (!K) bj9.info(`${Xn7}: Unavailable. The environment variables needed are: AZURE_CLIENT_ID (or the client ID sent through the parameters), AZURE_TENANT_ID and AZURE_FEDERATED_TOKEN_FILE`);
            return K
        },
        async getToken(A, q = {}) {
            let {
                scopes: K,
                clientId: Y
            } = A, z = {};
            return new Md(Object.assign(Object.assign({
                clientId: Y,
                tenantId: process.env.AZURE_TENANT_ID,
                tokenFilePath: process.env.AZURE_FEDERATED_TOKEN_FILE
            }, z), {
                disableInstanceDiscovery: !0
            })).getToken(K, q)
        }
    }
})
// @from(Ln 189865, Col 0)
class ts {
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
        let _ = [{
            key: "clientId",
            value: this.clientId
        }, {
            key: "resourceId",
            value: this.resourceId
        }, {
            key: "objectId",
            value: this.objectId
        }].filter((O) => O.value);
        if (_.length > 1) throw Error(`ManagedIdentityCredential: only one of 'clientId', 'resourceId', or 'objectId' can be provided. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}`);
        if (z.allowInsecureConnection = !0, ((K = z.retryOptions) === null || K === void 0 ? void 0 : K.maxRetries) !== void 0) this.msiRetryConfig.maxRetries = z.retryOptions.maxRetries;
        this.identityClient = new dm(Object.assign(Object.assign({}, z), {
            additionalPolicies: [{
                policy: Qi7(this.msiRetryConfig),
                position: "perCall"
            }]
        })), this.managedIdentityApp = new AB({
            managedIdentityIdParams: {
                userAssignedClientId: this.clientId,
                userAssignedResourceId: this.resourceId,
                userAssignedObjectId: this.objectId
            },
            system: {
                disableInternalRetries: !0,
                networkClient: this.identityClient,
                loggerOptions: {
                    logLevel: XM1(eH1()),
                    piiLoggingEnabled: (Y = z.loggingOptions) === null || Y === void 0 ? void 0 : Y.enableUnsafeSupportLogging,
                    loggerCallback: DM1(kk)
                }
            }
        }), this.isAvailableIdentityClient = new dm(Object.assign(Object.assign({}, z), {
            retryOptions: {
                maxRetries: 0
            }
        }));
        let w = this.managedIdentityApp.getManagedIdentitySource();
        if (w === "CloudShell") {
            if (this.clientId || this.resourceId || this.objectId) throw kk.warning(`CloudShell MSI detected with user-provided IDs - throwing. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}.`), new D4("ManagedIdentityCredential: Specifying a user-assigned managed identity is not supported for CloudShell at runtime. When using Managed Identity in CloudShell, omit the clientId, resourceId, and objectId parameters.")
        }
        if (w === "ServiceFabric") {
            if (this.clientId || this.resourceId || this.objectId) throw kk.warning(`Service Fabric detected with user-provided IDs - throwing. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}.`), new D4(`ManagedIdentityCredential: ${yp7}`)
        }
        if (kk.info(`Using ${w} managed identity.`), _.length === 1) {
            let {
                key: O,
                value: $
            } = _[0];
            kk.info(`${w} with ${O}: ${$}`)
        }
    }
    async getToken(A, q = {}) {
        kk.getToken.info("Using the MSAL provider for Managed Identity.");
        let K = Cm6(A);
        if (!K) throw new D4(`ManagedIdentityCredential: Multiple scopes are not supported. Scopes: ${JSON.stringify(A)}`);
        return bY.withSpan("ManagedIdentityCredential.getToken", q, async () => {
            var Y;
            try {
                let z = await CW8.isAvailable(this.clientId),
                    _ = this.managedIdentityApp.getManagedIdentitySource(),
                    w = _ === "DefaultToImds" || _ === "Imds";
                if (kk.getToken.info(`MSAL Identity source: ${_}`), z) {
                    kk.getToken.info("Using the token exchange managed identity.");
                    let $ = await CW8.getToken({
                        scopes: A,
                        clientId: this.clientId,
                        identityClient: this.identityClient,
                        retryConfig: this.msiRetryConfig,
                        resourceId: this.resourceId
                    });
                    if ($ === null) throw new D4("Attempted to use the token exchange managed identity, but received a null response.");
                    return $
                } else if (w) {
                    if (kk.getToken.info("Using the IMDS endpoint to probe for availability."), !await PW8.isAvailable({
                            scopes: A,
                            clientId: this.clientId,
                            getTokenOptions: q,
                            identityClient: this.isAvailableIdentityClient,
                            resourceId: this.resourceId
                        })) throw new D4("Attempted to use the IMDS endpoint, but it is not available.")
                }
                kk.getToken.info("Calling into MSAL for managed identity token.");
                let O = await this.managedIdentityApp.acquireToken({
                    resource: K
                });
                return this.ensureValidMsalToken(A, O, q), kk.getToken.info(UJ(A)), {
                    expiresOnTimestamp: O.expiresOn.getTime(),
                    token: O.accessToken,
                    refreshAfterTimestamp: (Y = O.refreshOn) === null || Y === void 0 ? void 0 : Y.getTime(),
                    tokenType: "Bearer"
                }
            } catch (z) {
                if (kk.getToken.error(d9(A, z)), z.name === "AuthenticationRequiredError") throw z;
                if (xj9(z)) throw new D4(`ManagedIdentityCredential: Network unreachable. Message: ${z.message}`, {
                    cause: z
                });
                throw new D4(`ManagedIdentityCredential: Authentication failed. Message ${z.message}`, {
                    cause: z
                })
            }
        })
    }
    ensureValidMsalToken(A, q, K) {
        let Y = (z) => {
            return kk.getToken.info(z), new cC({
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
// @from(Ln 189994, Col 0)
function xj9(A) {
    if (A.errorCode === "network_error") return !0;
    if (A.code === "ENETUNREACH" || A.code === "EHOSTUNREACH") return !0;
    if (A.statusCode === 403 || A.code === 403) {
        if (A.message.includes("unreachable")) return !0
    }
    return !1
}
// @from(Ln 190002, Col 4)
kk
// @from(Ln 190003, Col 4)
IW8 = E(() => {
    FK6();
    MM1();
    bm6();
    pM();
    PM1();
    Ui7();
    H2();
    dP();
    di7();
    Pn7();
    kk = h5("ManagedIdentityCredential")
})
// @from(Ln 190017, Col 0)
function Ek(A) {
    return Array.isArray(A) ? A : [A]
}
// @from(Ln 190021, Col 0)
function iP6(A, q) {
    if (!A.match(/^[0-9a-zA-Z-_.:/]+$/)) {
        let K = Error("Invalid scope was specified by the user or calling client");
        throw q.getToken.info(d9(A, K)), K
    }
}
// @from(Ln 190028, Col 0)
function TM1(A) {
    return A.replace(/\/.default$/, "")
}
// @from(Ln 190031, Col 4)
qB = E(() => {
    H2()
})
// @from(Ln 190035, Col 0)
function bW8(A, q) {
    if (!q.match(/^[0-9a-zA-Z-._ ]+$/)) {
        let K = Error("Invalid subscription provided. You can locate your subscription by following the instructions listed here: https://learn.microsoft.com/azure/azure-portal/get-subscription-tenant-id.");
        throw A.info(d9("", K)), K
    }
}
// @from(Ln 190041, Col 4)
Wn7 = E(() => {
    H2()
})
// @from(Ln 190045, Col 0)
class Zg6 {
    constructor(A) {
        if (A === null || A === void 0 ? void 0 : A.tenantId) dJ(oL, A === null || A === void 0 ? void 0 : A.tenantId), this.tenantId = A === null || A === void 0 ? void 0 : A.tenantId;
        if (A === null || A === void 0 ? void 0 : A.subscription) bW8(oL, A === null || A === void 0 ? void 0 : A.subscription), this.subscription = A === null || A === void 0 ? void 0 : A.subscription;
        this.additionallyAllowedTenantIds = _$(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), this.timeout = A === null || A === void 0 ? void 0 : A.processTimeoutInMs
    }
    async getToken(A, q = {}) {
        let K = WO(this.tenantId, q, this.additionallyAllowedTenantIds);
        if (K) dJ(oL, K);
        if (this.subscription) bW8(oL, this.subscription);
        let Y = typeof A === "string" ? A : A[0];
        return oL.getToken.info(`Using the scope ${Y}`), bY.withSpan(`${this.constructor.name}.getToken`, q, async () => {
            var z, _, w, O;
            try {
                iP6(Y, oL);
                let $ = TM1(Y),
                    H = await Zn7.getAzureCliAccessToken($, K, this.subscription, this.timeout),
                    j = (z = H.stderr) === null || z === void 0 ? void 0 : z.match("(.*)az login --scope(.*)"),
                    J = ((_ = H.stderr) === null || _ === void 0 ? void 0 : _.match("(.*)az login(.*)")) && !j;
                if (((w = H.stderr) === null || w === void 0 ? void 0 : w.match("az:(.*)not found")) || ((O = H.stderr) === null || O === void 0 ? void 0 : O.startsWith("'az' is not recognized"))) {
                    let D = new D4("Azure CLI could not be found. Please visit https://aka.ms/azure-cli for installation instructions and then, once installed, authenticate to your Azure account using 'az login'.");
                    throw oL.getToken.info(d9(A, D)), D
                }
                if (J) {
                    let D = new D4("Please run 'az login' from a command prompt to authenticate before using this credential.");
                    throw oL.getToken.info(d9(A, D)), D
                }
                try {
                    let D = H.stdout,
                        X = this.parseRawResponse(D);
                    return oL.getToken.info(UJ(A)), X
                } catch (D) {
                    if (H.stderr) throw new D4(H.stderr);
                    throw D
                }
            } catch ($) {
                let H = $.name === "CredentialUnavailableError" ? $ : new D4($.message || "Unknown error while trying to retrieve the access token");
                throw oL.getToken.info(d9(A, H)), H
            }
        })
    }
    parseRawResponse(A) {
        let q = JSON.parse(A),
            K = q.accessToken,
            Y = Number.parseInt(q.expires_on, 10) * 1000;
        if (!isNaN(Y)) return oL.getToken.info("expires_on is available and is valid, using it"), {
            token: K,
            expiresOnTimestamp: Y,
            tokenType: "Bearer"
        };
        if (Y = new Date(q.expiresOn).getTime(), isNaN(Y)) throw new D4(`Unexpected response from Azure CLI when getting token. Expected "expiresOn" to be a RFC3339 date string. Got: "${q.expiresOn}"`);
        return {
            token: K,
            expiresOnTimestamp: Y,
            tokenType: "Bearer"
        }
    }
}
// @from(Ln 190103, Col 4)
oL
// @from(Ln 190103, Col 8)
Zn7
// @from(Ln 190104, Col 4)
xW8 = E(() => {
    QM();
    H2();
    qB();
    pM();
    dP();
    Wn7();
    oL = h5("AzureCliCredential"), Zn7 = {
        getSafeWorkingDir() {
            if (process.platform === "win32") {
                let A = process.env.SystemRoot || process.env.SYSTEMROOT;
                if (!A) oL.getToken.warning("The SystemRoot environment variable is not set. This may cause issues when using the Azure CLI credential."), A = "C:\\Windows";
                return A
            } else return "/bin"
        },
        async getAzureCliAccessToken(A, q, K, Y) {
            let z = [],
                _ = [];
            if (q) z = ["--tenant", q];
            if (K) _ = ["--subscription", `"${K}"`];
            return new Promise((w, O) => {
                try {
                    uj9.execFile("az", ["account", "get-access-token", "--output", "json", "--resource", A, ...z, ..._], {
                        cwd: Zn7.getSafeWorkingDir(),
                        shell: !0,
                        timeout: Y
                    }, ($, H, j) => {
                        w({
                            stdout: H,
                            stderr: j,
                            error: $
                        })
                    })
                } catch ($) {
                    O($)
                }
            })
        }
    }
})
// @from(Ln 190145, Col 0)
class Gg6 {
    constructor(A) {
        if (A === null || A === void 0 ? void 0 : A.tenantId) dJ(Dd, A === null || A === void 0 ? void 0 : A.tenantId), this.tenantId = A === null || A === void 0 ? void 0 : A.tenantId;
        this.additionallyAllowedTenantIds = _$(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), this.timeout = A === null || A === void 0 ? void 0 : A.processTimeoutInMs
    }
    async getToken(A, q = {}) {
        let K = WO(this.tenantId, q, this.additionallyAllowedTenantIds);
        if (K) dJ(Dd, K);
        let Y;
        if (typeof A === "string") Y = [A];
        else Y = A;
        return Dd.getToken.info(`Using the scopes ${A}`), bY.withSpan(`${this.constructor.name}.getToken`, q, async () => {
            var z, _, w, O;
            try {
                Y.forEach((J) => {
                    iP6(J, Dd)
                });
                let $ = await Gn7.getAzdAccessToken(Y, K, this.timeout),
                    H = ((z = $.stderr) === null || z === void 0 ? void 0 : z.match("not logged in, run `azd login` to login")) || ((_ = $.stderr) === null || _ === void 0 ? void 0 : _.match("not logged in, run `azd auth login` to login"));
                if (((w = $.stderr) === null || w === void 0 ? void 0 : w.match("azd:(.*)not found")) || ((O = $.stderr) === null || O === void 0 ? void 0 : O.startsWith("'azd' is not recognized")) || $.error && $.error.code === "ENOENT") {
                    let J = new D4("Azure Developer CLI couldn't be found. To mitigate this issue, see the troubleshooting guidelines at https://aka.ms/azsdk/js/identity/azdevclicredential/troubleshoot.");
                    throw Dd.getToken.info(d9(A, J)), J
                }
                if (H) {
                    let J = new D4("Please run 'azd auth login' from a command prompt to authenticate before using this credential. For more information, see the troubleshooting guidelines at https://aka.ms/azsdk/js/identity/azdevclicredential/troubleshoot.");
                    throw Dd.getToken.info(d9(A, J)), J
                }
                try {
                    let J = JSON.parse($.stdout);
                    return Dd.getToken.info(UJ(A)), {
                        token: J.token,
                        expiresOnTimestamp: new Date(J.expiresOn).getTime(),
                        tokenType: "Bearer"
                    }
                } catch (J) {
                    if ($.stderr) throw new D4($.stderr);
                    throw J
                }
            } catch ($) {
                let H = $.name === "CredentialUnavailableError" ? $ : new D4($.message || "Unknown error while trying to retrieve the access token");
                throw Dd.getToken.info(d9(A, H)), H
            }
        })
    }
}
// @from(Ln 190190, Col 4)
Dd
// @from(Ln 190190, Col 8)
Gn7
// @from(Ln 190191, Col 4)
uW8 = E(() => {
    H2();
    pM();
    QM();
    dP();
    qB();
    Dd = h5("AzureDeveloperCliCredential"), Gn7 = {
        getSafeWorkingDir() {
            if (process.platform === "win32") {
                let A = process.env.SystemRoot || process.env.SYSTEMROOT;
                if (!A) Dd.getToken.warning("The SystemRoot environment variable is not set. This may cause issues when using the Azure Developer CLI credential."), A = "C:\\Windows";
                return A
            } else return "/bin"
        },
        async getAzdAccessToken(A, q, K) {
            let Y = [];
            if (q) Y = ["--tenant-id", q];
            return new Promise((z, _) => {
                try {
                    mj9.execFile("azd", ["auth", "token", "--output", "json", ...A.reduce((w, O) => w.concat("--scope", O), []), ...Y], {
                        cwd: Gn7.getSafeWorkingDir(),
                        timeout: K
                    }, (w, O, $) => {
                        z({
                            stdout: O,
                            stderr: $,
                            error: w
                        })
                    })
                } catch (w) {
                    _(w)
                }
            })
        }
    }
})
// @from(Ln 190228, Col 4)
Tn7
// @from(Ln 190229, Col 4)
vn7 = E(() => {
    Tn7 = {
        execFile(A, q, K) {
            return new Promise((Y, z) => {
                fn7.execFile(A, q, K, (_, w, O) => {
                    if (Buffer.isBuffer(w)) w = w.toString("utf8");
                    if (Buffer.isBuffer(O)) O = O.toString("utf8");
                    if (O || _) z(O ? Error(O) : _);
                    else Y(w)
                })
            })
        }
    }
})
// @from(Ln 190244, Col 0)
function kn7(A) {
    if (Vn7) return `${A}.exe`;
    else return A
}
// @from(Ln 190248, Col 0)
async function Nn7(A, q) {
    let K = [];
    for (let Y of A) {
        let [z, ..._] = Y, w = await Tn7.execFile(z, _, {
            encoding: "utf8",
            timeout: q
        });
        K.push(w)
    }
    return K
}
// @from(Ln 190259, Col 0)
class fg6 {
    constructor(A) {
        if (A === null || A === void 0 ? void 0 : A.tenantId) dJ(Xd, A === null || A === void 0 ? void 0 : A.tenantId), this.tenantId = A === null || A === void 0 ? void 0 : A.tenantId;
        this.additionallyAllowedTenantIds = _$(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), this.timeout = A === null || A === void 0 ? void 0 : A.processTimeoutInMs
    }
    async getAzurePowerShellAccessToken(A, q, K) {
        for (let Y of [...BW8]) {
            try {
                await Nn7([
                    [Y, "/?"]
                ], K)
            } catch (w) {
                BW8.shift();
                continue
            }
            let _ = (await Nn7([
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
            return Fj9(_)
        }
        throw Error("Unable to execute PowerShell. Ensure that it is installed in your system")
    }
    async getToken(A, q = {}) {
        return bY.withSpan(`${this.constructor.name}.getToken`, q, async () => {
            let K = WO(this.tenantId, q, this.additionallyAllowedTenantIds),
                Y = typeof A === "string" ? A : A[0];
            if (K) dJ(Xd, K);
            try {
                iP6(Y, Xd), Xd.getToken.info(`Using the scope ${Y}`);
                let z = TM1(Y),
                    _ = await this.getAzurePowerShellAccessToken(z, K, this.timeout);
                return Xd.getToken.info(UJ(A)), {
                    token: _.Token,
                    expiresOnTimestamp: new Date(_.ExpiresOn).getTime(),
                    tokenType: "Bearer"
                }
            } catch (z) {
                if (gj9(z)) {
                    let w = new D4(mW8.installed);
                    throw Xd.getToken.info(d9(Y, w)), w
                } else if (Bj9(z)) {
                    let w = new D4(mW8.login);
                    throw Xd.getToken.info(d9(Y, w)), w
                }
                let _ = new D4(`${z}. ${mW8.troubleshoot}`);
                throw Xd.getToken.info(d9(Y, _)), _
            }
        })
    }
}
// @from(Ln 190337, Col 0)
async function Fj9(A) {
    let q = /{[^{}]*}/g,
        K = A.match(q),
        Y = A;
    if (K) try {
        for (let z of K) try {
            let _ = JSON.parse(z);
            if (_ === null || _ === void 0 ? void 0 : _.Token) {
                if (Y = Y.replace(z, ""), Y) Xd.getToken.warning(Y);
                return _
            }
        } catch (_) {
            continue
        }
    } catch (z) {
        throw Error(`Unable to parse the output of PowerShell. Received output: ${A}`)
    }
    throw Error(`No access token found in the output. Received output: ${A}`)
}
// @from(Ln 190356, Col 4)
Xd
// @from(Ln 190356, Col 8)
Vn7
// @from(Ln 190356, Col 13)
En7
// @from(Ln 190356, Col 18)
mW8
// @from(Ln 190356, Col 23)
Bj9 = (A) => A.message.match(`(.*)${En7.login}(.*)`)
// @from(Ln 190357, Col 4)
gj9 = (A) => A.message.match(En7.installed)
// @from(Ln 190358, Col 4)
BW8
// @from(Ln 190359, Col 4)
gW8 = E(() => {
    QM();
    H2();
    qB();
    pM();
    vn7();
    dP();
    Xd = h5("AzurePowerShellCredential"), Vn7 = process.platform === "win32";
    En7 = {
        login: "Run Connect-AzAccount to login",
        installed: "The specified module 'Az.Accounts' with version '2.2.0' was not loaded because no valid module file was found in any module directory"
    }, mW8 = {
        login: "Please run 'Connect-AzAccount' from PowerShell to authenticate before using this credential.",
        installed: `The 'Az.Account' module >= 2.2.0 is not installed. Install the Azure Az PowerShell module with: "Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force".`,
        troubleshoot: "To troubleshoot, visit https://aka.ms/azsdk/js/identity/powershellcredential/troubleshoot."
    }, BW8 = [kn7("pwsh")];
    if (Vn7) BW8.push(kn7("powershell"))
})
// @from(Ln 190377, Col 0)
class Tg6 {
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
        return bY.withSpan("ChainedTokenCredential.getToken", q, async (_) => {
            for (let w = 0; w < this._sources.length && K === null; w++) try {
                K = await this._sources[w].getToken(A, _), Y = this._sources[w]
            } catch (O) {
                if (O.name === "CredentialUnavailableError" || O.name === "AuthenticationRequiredError") z.push(O);
                else throw FW8.getToken.info(d9(A, O)), O
            }
            if (!K && z.length > 0) {
                let w = new Xm6(z, "ChainedTokenCredential authentication failed.");
                throw FW8.getToken.info(d9(A, w)), w
            }
            if (FW8.getToken.info(`Result for ${Y.constructor.name}: ${UJ(A)}`), K === null) throw new D4("Failed to retrieve a valid token");
            return {
                token: K,
                successfulCredential: Y
            }
        })
    }
}
// @from(Ln 190409, Col 4)
FW8
// @from(Ln 190410, Col 4)
pW8 = E(() => {
    pM();
    H2();
    dP();
    FW8 = h5("ChainedTokenCredential")
})
// @from(Ln 190423, Col 0)
class Ng6 {
    constructor(A, q, K, Y = {}) {
        if (!A || !q) throw Error(`${vg6}: tenantId and clientId are required parameters.`);
        this.tenantId = A, this.additionallyAllowedTenantIds = _$(Y === null || Y === void 0 ? void 0 : Y.additionallyAllowedTenants), this.sendCertificateChain = Y.sendCertificateChain, this.certificateConfiguration = Object.assign({}, typeof K === "string" ? {
            certificatePath: K
        } : K);
        let z = this.certificateConfiguration.certificate,
            _ = this.certificateConfiguration.certificatePath;
        if (!this.certificateConfiguration || !(z || _)) throw Error(`${vg6}: Provide either a PEM certificate in string form, or the path to that certificate in the filesystem. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        if (z && _) throw Error(`${vg6}: To avoid unexpected behaviors, providing both the contents of a PEM certificate and the path to a PEM certificate is forbidden. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        this.msalClient = oW(q, A, Object.assign(Object.assign({}, Y), {
            logger: Ln7,
            tokenCredentialOptions: Y
        }))
    }
    async getToken(A, q = {}) {
        return bY.withSpan(`${vg6}.getToken`, q, async (K) => {
            K.tenantId = WO(this.tenantId, K, this.additionallyAllowedTenantIds, Ln7);
            let Y = Array.isArray(A) ? A : [A],
                z = await this.buildClientCertificate();
            return this.msalClient.getTokenByClientCertificate(Y, z, K)
        })
    }
    async buildClientCertificate() {
        var A;
        let q = await Uj9(this.certificateConfiguration, (A = this.sendCertificateChain) !== null && A !== void 0 ? A : !1),
            K;
        if (this.certificateConfiguration.certificatePassword !== void 0) K = pj9({
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
// @from(Ln 190467, Col 0)
async function Uj9(A, q) {
    let {
        certificate: K,
        certificatePath: Y
    } = A, z = K || await Qj9(Y, "utf8"), _ = q ? z : void 0, w = /(-+BEGIN CERTIFICATE-+)(\n\r?|\r\n?)([A-Za-z0-9+/\n\r]+=*)(\n\r?|\r\n?)(-+END CERTIFICATE-+)/g, O = [], $;
    do
        if ($ = w.exec(z), $) O.push($[3]); while ($);
    if (O.length === 0) throw Error("The file at the specified path does not contain a PEM-encoded certificate.");
    let H = yn7("sha1").update(Buffer.from(O[0], "base64")).digest("hex").toUpperCase(),
        j = yn7("sha256").update(Buffer.from(O[0], "base64")).digest("hex").toUpperCase();
    return {
        certificateContents: z,
        thumbprintSha256: j,
        thumbprint: H,
        x5c: _
    }
}
// @from(Ln 190484, Col 4)
vg6 = "ClientCertificateCredential"
// @from(Ln 190485, Col 4)
Ln7
// @from(Ln 190486, Col 4)
QW8 = E(() => {
    Jd();
    QM();
    H2();
    dP();
    Ln7 = h5(vg6)
})
// @from(Ln 190493, Col 0)
class Vg6 {
    constructor(A, q, K, Y = {}) {
        if (!A) throw new D4("ClientSecretCredential: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
        if (!q) throw new D4("ClientSecretCredential: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
        if (!K) throw new D4("ClientSecretCredential: clientSecret is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
        this.clientSecret = K, this.tenantId = A, this.additionallyAllowedTenantIds = _$(Y === null || Y === void 0 ? void 0 : Y.additionallyAllowedTenants), this.msalClient = oW(q, A, Object.assign(Object.assign({}, Y), {
            logger: Rn7,
            tokenCredentialOptions: Y
        }))
    }
    async getToken(A, q = {}) {
        return bY.withSpan(`${this.constructor.name}.getToken`, q, async (K) => {
            K.tenantId = WO(this.tenantId, K, this.additionallyAllowedTenantIds, Rn7);
            let Y = Ek(A);
            return this.msalClient.getTokenByClientSecret(Y, this.clientSecret, K)
        })
    }
}
// @from(Ln 190511, Col 4)
Rn7
// @from(Ln 190512, Col 4)
UW8 = E(() => {
    Jd();
    QM();
    pM();
    H2();
    qB();
    dP();
    Rn7 = h5("ClientSecretCredential")
})
// @from(Ln 190521, Col 0)
class kg6 {
    constructor(A, q, K, Y, z = {}) {
        if (!A) throw new D4("UsernamePasswordCredential: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
        if (!q) throw new D4("UsernamePasswordCredential: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
        if (!K) throw new D4("UsernamePasswordCredential: username is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
        if (!Y) throw new D4("UsernamePasswordCredential: password is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
        this.tenantId = A, this.additionallyAllowedTenantIds = _$(z === null || z === void 0 ? void 0 : z.additionallyAllowedTenants), this.username = K, this.password = Y, this.msalClient = oW(q, this.tenantId, Object.assign(Object.assign({}, z), {
            tokenCredentialOptions: z !== null && z !== void 0 ? z : {}
        }))
    }
    async getToken(A, q = {}) {
        return bY.withSpan(`${this.constructor.name}.getToken`, q, async (K) => {
            K.tenantId = WO(this.tenantId, K, this.additionallyAllowedTenantIds, dj9);
            let Y = Ek(A);
            return this.msalClient.getTokenByUsernamePassword(Y, this.username, this.password, K)
        })
    }
}
// @from(Ln 190539, Col 4)
dj9
// @from(Ln 190540, Col 4)
dW8 = E(() => {
    Jd();
    QM();
    pM();
    H2();
    qB();
    dP();
    dj9 = h5("UsernamePasswordCredential")
})
// @from(Ln 190550, Col 0)
function lj9() {
    var A;
    return ((A = process.env.AZURE_ADDITIONALLY_ALLOWED_TENANTS) !== null && A !== void 0 ? A : "").split(";")
}
// @from(Ln 190555, Col 0)
function ij9() {
    var A;
    let q = ((A = process.env.AZURE_CLIENT_SEND_CERTIFICATE_CHAIN) !== null && A !== void 0 ? A : "").toLowerCase(),
        K = q === "true" || q === "1";
    return Pd.verbose(`AZURE_CLIENT_SEND_CERTIFICATE_CHAIN: ${process.env.AZURE_CLIENT_SEND_CERTIFICATE_CHAIN}; sendCertificateChain: ${K}`), K
}
// @from(Ln 190561, Col 0)
class Eg6 {
    constructor(A) {
        this._credential = void 0;
        let q = Aj1(cj9).assigned.join(", ");
        Pd.info(`Found the following environment variables: ${q}`);
        let K = process.env.AZURE_TENANT_ID,
            Y = process.env.AZURE_CLIENT_ID,
            z = process.env.AZURE_CLIENT_SECRET,
            _ = lj9(),
            w = ij9(),
            O = Object.assign(Object.assign({}, A), {
                additionallyAllowedTenantIds: _,
                sendCertificateChain: w
            });
        if (K) dJ(Pd, K);
        if (K && Y && z) {
            Pd.info(`Invoking ClientSecretCredential with tenant ID: ${K}, clientId: ${Y} and clientSecret: [REDACTED]`), this._credential = new Vg6(K, Y, z, O);
            return
        }
        let $ = process.env.AZURE_CLIENT_CERTIFICATE_PATH,
            H = process.env.AZURE_CLIENT_CERTIFICATE_PASSWORD;
        if (K && Y && $) {
            Pd.info(`Invoking ClientCertificateCredential with tenant ID: ${K}, clientId: ${Y} and certificatePath: ${$}`), this._credential = new Ng6(K, Y, {
                certificatePath: $,
                certificatePassword: H
            }, O);
            return
        }
        let j = process.env.AZURE_USERNAME,
            J = process.env.AZURE_PASSWORD;
        if (K && Y && j && J) Pd.info(`Invoking UsernamePasswordCredential with tenant ID: ${K}, clientId: ${Y} and username: ${j}`), Pd.warning("Environment is configured to use username and password authentication. This authentication method is deprecated, as it doesn't support multifactor authentication (MFA). Use a more secure credential. For more details, see https://aka.ms/azsdk/identity/mfa."), this._credential = new kg6(K, Y, j, J, O)
    }
    async getToken(A, q = {}) {
        return bY.withSpan(`${vM1}.getToken`, q, async (K) => {
            if (this._credential) try {
                let Y = await this._credential.getToken(A, K);
                return Pd.getToken.info(UJ(A)), Y
            } catch (Y) {
                let z = new dC(400, {
                    error: `${vM1} authentication failed. To troubleshoot, visit https://aka.ms/azsdk/js/identity/environmentcredential/troubleshoot.`,
                    error_description: Y.message.toString().split("More details:").join("")
                });
                throw Pd.getToken.info(d9(A, z)), z
            }
            throw new D4(`${vM1} is unavailable. No underlying credential could be used. To troubleshoot, visit https://aka.ms/azsdk/js/identity/environmentcredential/troubleshoot.`)
        })
    }
}
// @from(Ln 190609, Col 4)
cj9
// @from(Ln 190609, Col 9)
vM1 = "EnvironmentCredential"
// @from(Ln 190610, Col 4)
Pd
// @from(Ln 190611, Col 4)
cW8 = E(() => {
    pM();
    H2();
    QW8();
    UW8();
    dW8();
    QM();
    dP();
    cj9 = ["AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_CLIENT_SECRET", "AZURE_CLIENT_CERTIFICATE_PATH", "AZURE_CLIENT_CERTIFICATE_PASSWORD", "AZURE_USERNAME", "AZURE_PASSWORD", "AZURE_ADDITIONALLY_ALLOWED_TENANTS", "AZURE_CLIENT_SEND_CERTIFICATE_CHAIN"];
    Pd = h5(vM1)
})
// @from(Ln 190623, Col 0)
function nj9(A = {}) {
    var q, K, Y, z;
    (q = A.retryOptions) !== null && q !== void 0 || (A.retryOptions = {
        maxRetries: 5,
        retryDelayInMs: 800
    });
    let _ = (K = A === null || A === void 0 ? void 0 : A.managedIdentityClientId) !== null && K !== void 0 ? K : process.env.AZURE_CLIENT_ID,
        w = (Y = A === null || A === void 0 ? void 0 : A.workloadIdentityClientId) !== null && Y !== void 0 ? Y : _,
        O = A === null || A === void 0 ? void 0 : A.managedIdentityResourceId,
        $ = process.env.AZURE_FEDERATED_TOKEN_FILE,
        H = (z = A === null || A === void 0 ? void 0 : A.tenantId) !== null && z !== void 0 ? z : process.env.AZURE_TENANT_ID;
    if (O) {
        let j = Object.assign(Object.assign({}, A), {
            resourceId: O
        });
        return new ts(j)
    }
    if ($ && w) {
        let j = Object.assign(Object.assign({}, A), {
            tenantId: H
        });
        return new ts(w, j)
    }
    if (_) {
        let j = Object.assign(Object.assign({}, A), {
            clientId: _
        });
        return new ts(j)
    }
    return new ts(A)
}
// @from(Ln 190655, Col 0)
function rj9(A) {
    var q, K, Y;
    let z = (q = A === null || A === void 0 ? void 0 : A.managedIdentityClientId) !== null && q !== void 0 ? q : process.env.AZURE_CLIENT_ID,
        _ = (K = A === null || A === void 0 ? void 0 : A.workloadIdentityClientId) !== null && K !== void 0 ? K : z,
        w = process.env.AZURE_FEDERATED_TOKEN_FILE,
        O = (Y = A === null || A === void 0 ? void 0 : A.tenantId) !== null && Y !== void 0 ? Y : process.env.AZURE_TENANT_ID;
    if (w && _) {
        let $ = Object.assign(Object.assign({}, A), {
            tenantId: O,
            clientId: _,
            tokenFilePath: w
        });
        return new Md($)
    }
    if (O) {
        let $ = Object.assign(Object.assign({}, A), {
            tenantId: O
        });
        return new Md($)
    }
    return new Md(A)
}
// @from(Ln 190678, Col 0)
function oj9(A = {}) {
    let q = A.processTimeoutInMs;
    return new Gg6(Object.assign({
        processTimeoutInMs: q
    }, A))
}
// @from(Ln 190685, Col 0)
function aj9(A = {}) {
    let q = A.processTimeoutInMs;
    return new Zg6(Object.assign({
        processTimeoutInMs: q
    }, A))
}
// @from(Ln 190692, Col 0)
function sj9(A = {}) {
    let q = A.processTimeoutInMs;
    return new fg6(Object.assign({
        processTimeoutInMs: q
    }, A))
}
// @from(Ln 190699, Col 0)
function tj9(A = {}) {
    return new Eg6(A)
}
// @from(Ln 190702, Col 0)
class hn7 {
    constructor(A, q) {
        this.credentialName = A, this.credentialUnavailableErrorMessage = q
    }
    getToken() {
        return lW8.getToken.info(`Skipping ${this.credentialName}, reason: ${this.credentialUnavailableErrorMessage}`), Promise.resolve(null)
    }
}
// @from(Ln 190710, Col 4)
lW8
// @from(Ln 190710, Col 9)
yg6
// @from(Ln 190711, Col 4)
iW8 = E(() => {
    IW8();
    xW8();
    uW8();
    gW8();
    pW8();
    cW8();
    fM1();
    H2();
    lW8 = h5("DefaultAzureCredential");
    yg6 = class yg6 extends Tg6 {
        constructor(A) {
            let q = process.env.AZURE_TOKEN_CREDENTIALS ? process.env.AZURE_TOKEN_CREDENTIALS.trim().toLowerCase() : void 0,
                K = [aj9, sj9, oj9],
                Y = [tj9, rj9, nj9],
                z = [];
            if (q) switch (q) {
                case "dev":
                    z = K;
                    break;
                case "prod":
                    z = Y;
                    break;
                default: {
                    let w = `Invalid value for AZURE_TOKEN_CREDENTIALS = ${process.env.AZURE_TOKEN_CREDENTIALS}. Valid values are 'prod' or 'dev'.`;
                    throw lW8.warning(w), Error(w)
                }
            } else z = [...Y, ...K];
            let _ = z.map((w) => {
                try {
                    return w(A)
                } catch (O) {
                    return lW8.warning(`Skipped ${w.name} because of an error creating the credential: ${O}`), new hn7(w.name, O.message)
                }
            });
            super(..._)
        }
    }
})
// @from(Ln 190750, Col 0)
class rW8 {
    constructor(A) {
        var q, K, Y, z, _;
        this.tenantId = zP6(nW8, A.tenantId, A.clientId), this.additionallyAllowedTenantIds = _$(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants);
        let w = Object.assign(Object.assign({}, A), {
                tokenCredentialOptions: A,
                logger: nW8
            }),
            O = A;
        if (this.browserCustomizationOptions = O.browserCustomizationOptions, this.loginHint = O.loginHint, (q = O === null || O === void 0 ? void 0 : O.brokerOptions) === null || q === void 0 ? void 0 : q.enabled)
            if (!((K = O === null || O === void 0 ? void 0 : O.brokerOptions) === null || K === void 0 ? void 0 : K.parentWindowHandle)) throw Error("In order to do WAM authentication, `parentWindowHandle` under `brokerOptions` is a required parameter");
            else w.brokerOptions = {
                enabled: !0,
                parentWindowHandle: O.brokerOptions.parentWindowHandle,
                legacyEnableMsaPassthrough: (Y = O.brokerOptions) === null || Y === void 0 ? void 0 : Y.legacyEnableMsaPassthrough,
                useDefaultBrokerAccount: (z = O.brokerOptions) === null || z === void 0 ? void 0 : z.useDefaultBrokerAccount
            };
        this.msalClient = oW((_ = A.clientId) !== null && _ !== void 0 ? _ : gK6, this.tenantId, w), this.disableAutomaticAuthentication = A === null || A === void 0 ? void 0 : A.disableAutomaticAuthentication
    }
    async getToken(A, q = {}) {
        return bY.withSpan(`${this.constructor.name}.getToken`, q, async (K) => {
            K.tenantId = WO(this.tenantId, K, this.additionallyAllowedTenantIds, nW8);
            let Y = Ek(A);
            return this.msalClient.getTokenByInteractiveRequest(Y, Object.assign(Object.assign({}, K), {
                disableAutomaticAuthentication: this.disableAutomaticAuthentication,
                browserCustomizationOptions: this.browserCustomizationOptions,
                loginHint: this.loginHint
            }))
        })
    }
    async authenticate(A, q = {}) {
        return bY.withSpan(`${this.constructor.name}.authenticate`, q, async (K) => {
            let Y = Ek(A);
            return await this.msalClient.getTokenByInteractiveRequest(Y, Object.assign(Object.assign({}, K), {
                disableAutomaticAuthentication: !1,
                browserCustomizationOptions: this.browserCustomizationOptions,
                loginHint: this.loginHint
            })), this.msalClient.getActiveAccount()
        })
    }
}
// @from(Ln 190791, Col 4)
nW8
// @from(Ln 190792, Col 4)
Sn7 = E(() => {
    QM();
    H2();
    qB();
    dP();
    Jd();
    Bm();
    nW8 = h5("InteractiveBrowserCredential")
})
// @from(Ln 190802, Col 0)
function ej9(A) {
    console.log(A.message)
}
// @from(Ln 190805, Col 0)
class aW8 {
    constructor(A) {
        var q, K;
        this.tenantId = A === null || A === void 0 ? void 0 : A.tenantId, this.additionallyAllowedTenantIds = _$(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants);
        let Y = (q = A === null || A === void 0 ? void 0 : A.clientId) !== null && q !== void 0 ? q : gK6,
            z = zP6(oW8, A === null || A === void 0 ? void 0 : A.tenantId, Y);
        this.userPromptCallback = (K = A === null || A === void 0 ? void 0 : A.userPromptCallback) !== null && K !== void 0 ? K : ej9, this.msalClient = oW(Y, z, Object.assign(Object.assign({}, A), {
            logger: oW8,
            tokenCredentialOptions: A || {}
        })), this.disableAutomaticAuthentication = A === null || A === void 0 ? void 0 : A.disableAutomaticAuthentication
    }
    async getToken(A, q = {}) {
        return bY.withSpan(`${this.constructor.name}.getToken`, q, async (K) => {
            K.tenantId = WO(this.tenantId, K, this.additionallyAllowedTenantIds, oW8);
            let Y = Ek(A);
            return this.msalClient.getTokenByDeviceCode(Y, this.userPromptCallback, Object.assign(Object.assign({}, K), {
                disableAutomaticAuthentication: this.disableAutomaticAuthentication
            }))
        })
    }
    async authenticate(A, q = {}) {
        return bY.withSpan(`${this.constructor.name}.authenticate`, q, async (K) => {
            let Y = Array.isArray(A) ? A : [A];
            return await this.msalClient.getTokenByDeviceCode(Y, this.userPromptCallback, Object.assign(Object.assign({}, K), {
                disableAutomaticAuthentication: !1
            })), this.msalClient.getActiveAccount()
        })
    }
}
// @from(Ln 190834, Col 4)
oW8
// @from(Ln 190835, Col 4)
Cn7 = E(() => {
    QM();
    H2();
    qB();
    dP();
    Jd();
    Bm();
    oW8 = h5("DeviceCodeCredential")
})
// @from(Ln 190844, Col 0)
class sW8 {
    constructor(A, q, K, Y, z = {}) {
        var _, w;
        if (!q) throw new D4(`${AI}: is unavailable. clientId is a required parameter.`);
        if (!A) throw new D4(`${AI}: is unavailable. tenantId is a required parameter.`);
        if (!K) throw new D4(`${AI}: is unavailable. serviceConnectionId is a required parameter.`);
        if (!Y) throw new D4(`${AI}: is unavailable. systemAccessToken is a required parameter.`);
        if (z.loggingOptions = Object.assign(Object.assign({}, z === null || z === void 0 ? void 0 : z.loggingOptions), {
                additionalAllowedHeaderNames: [...(w = (_ = z.loggingOptions) === null || _ === void 0 ? void 0 : _.additionalAllowedHeaderNames) !== null && w !== void 0 ? w : [], "x-vss-e2eid", "x-msedge-ref"]
            }), this.identityClient = new dm(z), dJ(aL, A), aL.info(`Invoking AzurePipelinesCredential with tenant ID: ${A}, client ID: ${q}, and service connection ID: ${K}`), !process.env.SYSTEM_OIDCREQUESTURI) throw new D4(`${AI}: is unavailable. Ensure that you're running this task in an Azure Pipeline, so that following missing system variable(s) can be defined- "SYSTEM_OIDCREQUESTURI"`);
        let O = `${process.env.SYSTEM_OIDCREQUESTURI}?api-version=${AJ9}&serviceConnectionId=${K}`;
        aL.info(`Invoking ClientAssertionCredential with tenant ID: ${A}, client ID: ${q} and service connection ID: ${K}`), this.clientAssertionCredential = new r56(A, q, this.requestOidcToken.bind(this, O, Y), z)
    }
    async getToken(A, q) {
        if (!this.clientAssertionCredential) {
            let K = `${AI}: is unavailable. To use Federation Identity in Azure Pipelines, the following parameters are required - 
      tenantId,
      clientId,
      serviceConnectionId,
      systemAccessToken,
      "SYSTEM_OIDCREQUESTURI".      
      See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/azurepipelinescredential/troubleshoot`;
            throw aL.error(K), new D4(K)
        }
        return aL.info("Invoking getToken() of Client Assertion Credential"), this.clientAssertionCredential.getToken(A, q)
    }
    async requestOidcToken(A, q) {
        aL.info("Requesting OIDC token from Azure Pipelines..."), aL.info(A);
        let K = fk({
                url: A,
                method: "POST",
                headers: dU({
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${q}`,
                    "X-TFS-FedAuthRedirect": "Suppress"
                })
            }),
            Y = await this.identityClient.sendRequest(K);
        return qJ9(Y)
    }
}
// @from(Ln 190886, Col 0)
function qJ9(A) {
    let q = A.bodyAsText;
    if (!q) throw aL.error(`${AI}: Authentication Failed. Received null token from OIDC request. Response status- ${A.status}. Complete response - ${JSON.stringify(A)}`), new dC(A.status, {
        error: `${AI}: Authentication Failed. Received null token from OIDC request.`,
        error_description: `${JSON.stringify(A)}. See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/azurepipelinescredential/troubleshoot`
    });
    try {
        let K = JSON.parse(q);
        if (K === null || K === void 0 ? void 0 : K.oidcToken) return K.oidcToken;
        else {
            let Y = `${AI}: Authentication Failed. oidcToken field not detected in the response.`,
                z = "";
            if (A.status !== 200) z = `Response body = ${q}. Response Headers ["x-vss-e2eid"] = ${A.headers.get("x-vss-e2eid")} and ["x-msedge-ref"] = ${A.headers.get("x-msedge-ref")}. See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/azurepipelinescredential/troubleshoot`;
            throw aL.error(Y), aL.error(z), new dC(A.status, {
                error: Y,
                error_description: z
            })
        }
    } catch (K) {
        let Y = `${AI}: Authentication Failed. oidcToken field not detected in the response.`;
        throw aL.error(`Response from service = ${q}, Response Headers ["x-vss-e2eid"] = ${A.headers.get("x-vss-e2eid")} 
      and ["x-msedge-ref"] = ${A.headers.get("x-msedge-ref")}, error message = ${K.message}`), aL.error(Y), new dC(A.status, {
            error: Y,
            error_description: `Response = ${q}. Response headers ["x-vss-e2eid"] = ${A.headers.get("x-vss-e2eid")} and ["x-msedge-ref"] =  ${A.headers.get("x-msedge-ref")}. See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/azurepipelinescredential/troubleshoot`
        })
    }
}
// @from(Ln 190913, Col 4)
AI = "AzurePipelinesCredential"
// @from(Ln 190914, Col 4)
aL
// @from(Ln 190914, Col 8)
AJ9 = "7.1"
// @from(Ln 190915, Col 4)
In7 = E(() => {
    pM();
    Qm();
    GM1();
    bm6();
    QM();
    H2();
    aL = h5(AI)
})
// @from(Ln 190924, Col 0)
class tW8 {
    constructor(A, q, K, Y, z, _) {
        if (dJ(bn7, A), this.clientSecret = K, typeof z === "string") this.authorizationCode = Y, this.redirectUri = z;
        else this.authorizationCode = K, this.redirectUri = Y, this.clientSecret = void 0, _ = z;
        this.tenantId = A, this.additionallyAllowedTenantIds = _$(_ === null || _ === void 0 ? void 0 : _.additionallyAllowedTenants), this.msalClient = oW(q, A, Object.assign(Object.assign({}, _), {
            logger: bn7,
            tokenCredentialOptions: _ !== null && _ !== void 0 ? _ : {}
        }))
    }
    async getToken(A, q = {}) {
        return bY.withSpan(`${this.constructor.name}.getToken`, q, async (K) => {
            let Y = WO(this.tenantId, K, this.additionallyAllowedTenantIds);
            K.tenantId = Y;
            let z = Ek(A);
            return this.msalClient.getTokenByAuthorizationCode(z, this.redirectUri, this.authorizationCode, this.clientSecret, Object.assign(Object.assign({}, K), {
                disableAutomaticAuthentication: this.disableAutomaticAuthentication
            }))
        })
    }
}
// @from(Ln 190944, Col 4)
bn7
// @from(Ln 190945, Col 4)
xn7 = E(() => {
    QM();
    QM();
    H2();
    qB();
    dP();
    Jd();
    bn7 = h5("AuthorizationCodeCredential")
})
// @from(Ln 190960, Col 0)
class AZ8 {
    constructor(A) {
        let {
            clientSecret: q
        } = A, {
            certificatePath: K,
            sendCertificateChain: Y
        } = A, {
            getAssertion: z
        } = A, {
            tenantId: _,
            clientId: w,
            userAssertionToken: O,
            additionallyAllowedTenants: $
        } = A;
        if (!_) throw new D4(`${nP6}: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        if (!w) throw new D4(`${nP6}: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        if (!q && !K && !z) throw new D4(`${nP6}: You must provide one of clientSecret, certificatePath, or a getAssertion callback but none were provided. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        if (!O) throw new D4(`${nP6}: userAssertionToken is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
        this.certificatePath = K, this.clientSecret = q, this.userAssertionToken = O, this.sendCertificateChain = Y, this.clientAssertion = z, this.tenantId = _, this.additionallyAllowedTenantIds = _$($), this.msalClient = oW(w, this.tenantId, Object.assign(Object.assign({}, A), {
            logger: eW8,
            tokenCredentialOptions: A
        }))
    }
    async getToken(A, q = {}) {
        return bY.withSpan(`${nP6}.getToken`, q, async (K) => {
            K.tenantId = WO(this.tenantId, K, this.additionallyAllowedTenantIds, eW8);
            let Y = Ek(A);
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
            throw eW8.info(d9("", q)), q
        }
    }
    async parseCertificate(A, q) {
        let K = A.certificatePath,
            Y = await KJ9(K, "utf8"),
            z = q ? Y : void 0,
            _ = /(-+BEGIN CERTIFICATE-+)(\n\r?|\r\n?)([A-Za-z0-9+/\n\r]+=*)(\n\r?|\r\n?)(-+END CERTIFICATE-+)/g,
            w = [],
            O;
        do
            if (O = _.exec(Y), O) w.push(O[3]); while (O);
        if (w.length === 0) throw Error("The file at the specified path does not contain a PEM-encoded certificate.");
        let $ = un7("sha1").update(Buffer.from(w[0], "base64")).digest("hex").toUpperCase(),
            H = un7("sha256").update(Buffer.from(w[0], "base64")).digest("hex").toUpperCase();
        return {
            certificateContents: Y,
            thumbprintSha256: H,
            thumbprint: $,
            x5c: z
        }
    }
}
// @from(Ln 191031, Col 4)
nP6 = "OnBehalfOfCredential"
// @from(Ln 191032, Col 4)
eW8
// @from(Ln 191033, Col 4)
mn7 = E(() => {
    Jd();
    H2();
    QM();
    pM();
    qB();
    dP();
    eW8 = h5(nP6)
})
// @from(Ln 191043, Col 0)
function Bn7(A, q, K) {
    let {
        abortSignal: Y,
        tracingOptions: z
    } = K || {}, _ = Tm6();
    _.addPolicy(hm6({
        credential: A,
        scopes: q
    }));
    async function w() {
        var O;
        let H = (O = (await _.sendRequest({
            sendRequest: (j) => Promise.resolve({
                request: j,
                status: 200,
                headers: j.headers
            })
        }, fk({
            url: "https://example.com",
            abortSignal: Y,
            tracingOptions: z
        }))).headers.get("authorization")) === null || O === void 0 ? void 0 : O.split(" ")[1];
        if (!H) throw Error("Failed to get access token");
        return H
    }
    return w
}
// @from(Ln 191070, Col 4)
gn7 = E(() => {
    Qm()
})
// @from(Ln 191073, Col 4)
Fn7 = {}
// @from(Ln 191109, Col 0)
function YJ9() {
    return new yg6
}
// @from(Ln 191112, Col 4)
pn7 = E(() => {
    iW8();
    pM();
    PM1();
    pW8();
    UW8();
    iW8();
    cW8();
    QW8();
    GM1();
    xW8();
    uW8();
    Sn7();
    IW8();
    Cn7();
    In7();
    xn7();
    gW8();
    dW8();
    CX8();
    mn7();
    fM1();
    H2();
    Bm();
    gn7();
    Ip7()
})
// @from(Ln 191139, Col 4)
qZ8 = x((nh2, rn7) => {
    var NM1 = Object.prototype.hasOwnProperty,
        nn7 = Object.prototype.toString,
        Qn7 = Object.defineProperty,
        Un7 = Object.getOwnPropertyDescriptor,
        dn7 = function(q) {
            if (typeof Array.isArray === "function") return Array.isArray(q);
            return nn7.call(q) === "[object Array]"
        },
        cn7 = function(q) {
            if (!q || nn7.call(q) !== "[object Object]") return !1;
            var K = NM1.call(q, "constructor"),
                Y = q.constructor && q.constructor.prototype && NM1.call(q.constructor.prototype, "isPrototypeOf");
            if (q.constructor && !K && !Y) return !1;
            var z;
            for (z in q);
            return typeof z > "u" || NM1.call(q, z)
        },
        ln7 = function(q, K) {
            if (Qn7 && K.name === "__proto__") Qn7(q, K.name, {
                enumerable: !0,
                configurable: !0,
                value: K.newValue,
                writable: !0
            });
            else q[K.name] = K.newValue
        },
        in7 = function(q, K) {
            if (K === "__proto__") {
                if (!NM1.call(q, K)) return;
                else if (Un7) return Un7(q, K).value
            }
            return q[K]
        };
    rn7.exports = function A() {
        var q, K, Y, z, _, w, O = arguments[0],
            $ = 1,
            H = arguments.length,
            j = !1;
        if (typeof O === "boolean") j = O, O = arguments[1] || {}, $ = 2;
        if (O == null || typeof O !== "object" && typeof O !== "function") O = {};
        for (; $ < H; ++$)
            if (q = arguments[$], q != null) {
                for (K in q)
                    if (Y = in7(O, K), z = in7(q, K), O !== z) {
                        if (j && z && (cn7(z) || (_ = dn7(z)))) {
                            if (_) _ = !1, w = Y && dn7(Y) ? Y : [];
                            else w = Y && cn7(Y) ? Y : {};
                            ln7(O, {
                                name: K,
                                newValue: A(j, w, z)
                            })
                        } else if (typeof z < "u") ln7(O, {
                            name: K,
                            newValue: z
                        })
                    }
            } return O
    }
})
// @from(Ln 191199, Col 4)
kM1 = x((tn7) => {
    function M2(A, q, K) {
        if (K.globals) A = K.globals[A.name];
        return new A(`${K.context?K.context:"Value"} ${q}.`)
    }

    function aP6(A, q) {
        if (typeof A === "bigint") throw M2(TypeError, "is a BigInt which cannot be converted to a number", q);
        if (!q.globals) return Number(A);
        return q.globals.Number(A)
    }

    function an7(A) {
        if (A > 0 && A % 1 === 0.5 && (A & 1) === 0 || A < 0 && A % 1 === -0.5 && (A & 1) === 1) return Lg6(Math.floor(A));
        return Lg6(Math.round(A))
    }

    function VM1(A) {
        return Lg6(Math.trunc(A))
    }

    function on7(A) {
        return A < 0 ? -1 : 1
    }

    function zJ9(A, q) {
        let K = A % q;
        if (on7(q) !== on7(K)) return K + q;
        return K
    }

    function Lg6(A) {
        return A === 0 ? 0 : A
    }

    function sP6(A, {
        unsigned: q
    }) {
        let K, Y;
        if (q) K = 0, Y = 2 ** A - 1;
        else K = -(2 ** (A - 1)), Y = 2 ** (A - 1) - 1;
        let z = 2 ** A,
            _ = 2 ** (A - 1);
        return (w, O = {}) => {
            let $ = aP6(w, O);
            if ($ = Lg6($), O.enforceRange) {
                if (!Number.isFinite($)) throw M2(TypeError, "is not a finite number", O);
                if ($ = VM1($), $ < K || $ > Y) throw M2(TypeError, `is outside the accepted range of ${K} to ${Y}, inclusive`, O);
                return $
            }
            if (!Number.isNaN($) && O.clamp) return $ = Math.min(Math.max($, K), Y), $ = an7($), $;
            if (!Number.isFinite($) || $ === 0) return 0;
            if ($ = VM1($), $ >= K && $ <= Y) return $;
            if ($ = zJ9($, z), !q && $ >= _) return $ - z;
            return $
        }
    }

    function sn7(A, {
        unsigned: q
    }) {
        let K = Number.MAX_SAFE_INTEGER,
            Y = q ? 0 : Number.MIN_SAFE_INTEGER,
            z = q ? BigInt.asUintN : BigInt.asIntN;
        return (_, w = {}) => {
            let O = aP6(_, w);
            if (O = Lg6(O), w.enforceRange) {
                if (!Number.isFinite(O)) throw M2(TypeError, "is not a finite number", w);
                if (O = VM1(O), O < Y || O > K) throw M2(TypeError, `is outside the accepted range of ${Y} to ${K}, inclusive`, w);
                return O
            }
            if (!Number.isNaN(O) && w.clamp) return O = Math.min(Math.max(O, Y), K), O = an7(O), O;
            if (!Number.isFinite(O) || O === 0) return 0;
            let $ = BigInt(VM1(O));
            return $ = z(A, $), Number($)
        }
    }
    tn7.any = (A) => {
        return A
    };
    tn7.undefined = () => {
        return
    };
    tn7.boolean = (A) => {
        return Boolean(A)
    };
    tn7.byte = sP6(8, {
        unsigned: !1
    });
    tn7.octet = sP6(8, {
        unsigned: !0
    });
    tn7.short = sP6(16, {
        unsigned: !1
    });
    tn7["unsigned short"] = sP6(16, {
        unsigned: !0
    });
    tn7.long = sP6(32, {
        unsigned: !1
    });
    tn7["unsigned long"] = sP6(32, {
        unsigned: !0
    });
    tn7["long long"] = sn7(64, {
        unsigned: !1
    });
    tn7["unsigned long long"] = sn7(64, {
        unsigned: !0
    });
    tn7.double = (A, q = {}) => {
        let K = aP6(A, q);
        if (!Number.isFinite(K)) throw M2(TypeError, "is not a finite floating-point value", q);
        return K
    };
    tn7["unrestricted double"] = (A, q = {}) => {
        return aP6(A, q)
    };
    tn7.float = (A, q = {}) => {
        let K = aP6(A, q);
        if (!Number.isFinite(K)) throw M2(TypeError, "is not a finite floating-point value", q);
        if (Object.is(K, -0)) return K;
        let Y = Math.fround(K);
        if (!Number.isFinite(Y)) throw M2(TypeError, "is outside the range of a single-precision floating-point value", q);
        return Y
    };
    tn7["unrestricted float"] = (A, q = {}) => {
        let K = aP6(A, q);
        if (isNaN(K)) return K;
        if (Object.is(K, -0)) return K;
        return Math.fround(K)
    };
    tn7.DOMString = (A, q = {}) => {
        if (q.treatNullAsEmptyString && A === null) return "";
        if (typeof A === "symbol") throw M2(TypeError, "is a symbol, which cannot be converted to a string", q);
        return (q.globals ? q.globals.String : String)(A)
    };
    tn7.ByteString = (A, q = {}) => {
        let K = tn7.DOMString(A, q),
            Y;
        for (let z = 0;
            (Y = K.codePointAt(z)) !== void 0; ++z)
            if (Y > 255) throw M2(TypeError, "is not a valid ByteString", q);
        return K
    };
    tn7.USVString = (A, q = {}) => {
        let K = tn7.DOMString(A, q),
            Y = K.length,
            z = [];
        for (let _ = 0; _ < Y; ++_) {
            let w = K.charCodeAt(_);
            if (w < 55296 || w > 57343) z.push(String.fromCodePoint(w));
            else if (56320 <= w && w <= 57343) z.push(String.fromCodePoint(65533));
            else if (_ === Y - 1) z.push(String.fromCodePoint(65533));
            else {
                let O = K.charCodeAt(_ + 1);
                if (56320 <= O && O <= 57343) {
                    let $ = w & 1023,
                        H = O & 1023;
                    z.push(String.fromCodePoint(65536 + 1024 * $ + H)), ++_
                } else z.push(String.fromCodePoint(65533))
            }
        }
        return z.join("")
    };
    tn7.object = (A, q = {}) => {
        if (A === null || typeof A !== "object" && typeof A !== "function") throw M2(TypeError, "is not an object", q);
        return A
    };
    var _J9 = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get,
        wJ9 = typeof SharedArrayBuffer === "function" ? Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, "byteLength").get : null;

    function KZ8(A) {
        try {
            return _J9.call(A), !0
        } catch {
            return !1
        }
    }

    function rP6(A) {
        try {
            return wJ9.call(A), !0
        } catch {
            return !1
        }
    }

    function oP6(A) {
        try {
            return new Uint8Array(A), !1
        } catch {
            return !0
        }
    }
    tn7.ArrayBuffer = (A, q = {}) => {
        if (!KZ8(A)) {
            if (q.allowShared && !rP6(A)) throw M2(TypeError, "is not an ArrayBuffer or SharedArrayBuffer", q);
            throw M2(TypeError, "is not an ArrayBuffer", q)
        }
        if (oP6(A)) throw M2(TypeError, "is a detached ArrayBuffer", q);
        return A
    };
    var OJ9 = Object.getOwnPropertyDescriptor(DataView.prototype, "byteLength").get;
    tn7.DataView = (A, q = {}) => {
        try {
            OJ9.call(A)
        } catch (K) {
            throw M2(TypeError, "is not a DataView", q)
        }
        if (!q.allowShared && rP6(A.buffer)) throw M2(TypeError, "is backed by a SharedArrayBuffer, which is not allowed", q);
        if (oP6(A.buffer)) throw M2(TypeError, "is backed by a detached ArrayBuffer", q);
        return A
    };
    var $J9 = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array).prototype, Symbol.toStringTag).get;
    [Int8Array, Int16Array, Int32Array, Uint8Array, Uint16Array, Uint32Array, Uint8ClampedArray, Float32Array, Float64Array].forEach((A) => {
        let {
            name: q
        } = A, K = /^[AEIOU]/u.test(q) ? "an" : "a";
        tn7[q] = (Y, z = {}) => {
            if (!ArrayBuffer.isView(Y) || $J9.call(Y) !== q) throw M2(TypeError, `is not ${K} ${q} object`, z);
            if (!z.allowShared && rP6(Y.buffer)) throw M2(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", z);
            if (oP6(Y.buffer)) throw M2(TypeError, "is a view on a detached ArrayBuffer", z);
            return Y
        }
    });
    tn7.ArrayBufferView = (A, q = {}) => {
        if (!ArrayBuffer.isView(A)) throw M2(TypeError, "is not a view on an ArrayBuffer or SharedArrayBuffer", q);
        if (!q.allowShared && rP6(A.buffer)) throw M2(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", q);
        if (oP6(A.buffer)) throw M2(TypeError, "is a view on a detached ArrayBuffer", q);
        return A
    };
    tn7.BufferSource = (A, q = {}) => {
        if (ArrayBuffer.isView(A)) {
            if (!q.allowShared && rP6(A.buffer)) throw M2(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", q);
            if (oP6(A.buffer)) throw M2(TypeError, "is a view on a detached ArrayBuffer", q);
            return A
        }
        if (!q.allowShared && !KZ8(A)) throw M2(TypeError, "is not an ArrayBuffer or a view on one", q);
        if (q.allowShared && !rP6(A) && !KZ8(A)) throw M2(TypeError, "is not an ArrayBuffer, SharedArrayBuffer, or a view on one", q);
        if (oP6(A)) throw M2(TypeError, "is a detached ArrayBuffer", q);
        return A
    };
    tn7.DOMTimeStamp = tn7["unsigned long long"]
})
// @from(Ln 191444, Col 4)
yM1 = x((wr7, Or7) => {
    function CJ9(A) {
        return typeof A === "object" && A !== null || typeof A === "function"
    }
    var Ar7 = Function.prototype.call.bind(Object.prototype.hasOwnProperty);

    function IJ9(A, q) {
        for (let K of Reflect.ownKeys(q)) {
            let Y = Reflect.getOwnPropertyDescriptor(q, K);
            if (Y && !Reflect.defineProperty(A, K, Y)) throw TypeError(`Cannot redefine property: ${String(K)}`)
        }
    }

    function bJ9(A, q) {
        let K = Yr7(A);
        return Object.defineProperties(Object.create(K["%Object.prototype%"]), Object.getOwnPropertyDescriptors(q))
    }
    var qr7 = Symbol("wrapper"),
        Kr7 = Symbol("impl"),
        tP6 = Symbol("SameObject caches"),
        EM1 = Symbol.for("[webidl2js] constructor registry"),
        xJ9 = Object.getPrototypeOf(Object.getPrototypeOf(async function*() {}).prototype);

    function Yr7(A) {
        if (Ar7(A, EM1)) return A[EM1];
        let q = Object.create(null);
        q["%Object.prototype%"] = A.Object.prototype, q["%IteratorPrototype%"] = Object.getPrototypeOf(Object.getPrototypeOf(new A.Array()[Symbol.iterator]()));
        try {
            q["%AsyncIteratorPrototype%"] = Object.getPrototypeOf(Object.getPrototypeOf(A.eval("(async function* () {})").prototype))
        } catch {
            q["%AsyncIteratorPrototype%"] = xJ9
        }
        return A[EM1] = q, q
    }

    function uJ9(A, q, K) {
        if (!A[tP6]) A[tP6] = Object.create(null);
        if (q in A[tP6]) return A[tP6][q];
        return A[tP6][q] = K(), A[tP6][q]
    }

    function zr7(A) {
        return A ? A[qr7] : null
    }

    function _r7(A) {
        return A ? A[Kr7] : null
    }

    function mJ9(A) {
        let q = zr7(A);
        return q ? q : A
    }

    function BJ9(A) {
        let q = _r7(A);
        return q ? q : A
    }
    var gJ9 = Symbol("internal");

    function FJ9(A) {
        if (typeof A !== "string") return !1;
        let q = A >>> 0;
        if (q === 4294967295) return !1;
        let K = `${q}`;
        if (A !== K) return !1;
        return !0
    }
    var pJ9 = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get;

    function QJ9(A) {
        try {
            return pJ9.call(A), !0
        } catch (q) {
            return !1
        }
    }

    function UJ9([A, q], K) {
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
    var dJ9 = Symbol("supports property index"),
        cJ9 = Symbol("supported property indices"),
        lJ9 = Symbol("supports property name"),
        iJ9 = Symbol("supported property names"),
        nJ9 = Symbol("indexed property get"),
        rJ9 = Symbol("indexed property set new"),
        oJ9 = Symbol("indexed property set existing"),
        aJ9 = Symbol("named property get"),
        sJ9 = Symbol("named property set new"),
        tJ9 = Symbol("named property set existing"),
        eJ9 = Symbol("named property delete"),
        AM9 = Symbol("async iterator get the next iteration result"),
        qM9 = Symbol("async iterator return steps"),
        KM9 = Symbol("async iterator initialization steps"),
        YM9 = Symbol("async iterator end of iteration");
    Or7.exports = wr7 = {
        isObject: CJ9,
        hasOwn: Ar7,
        define: IJ9,
        newObjectInRealm: bJ9,
        wrapperSymbol: qr7,
        implSymbol: Kr7,
        getSameObject: uJ9,
        ctorRegistrySymbol: EM1,
        initCtorRegistry: Yr7,
        wrapperForImpl: zr7,
        implForWrapper: _r7,
        tryWrapperForImpl: mJ9,
        tryImplForWrapper: BJ9,
        iterInternalSymbol: gJ9,
        isArrayBuffer: QJ9,
        isArrayIndexPropName: FJ9,
        supportsPropertyIndex: dJ9,
        supportedPropertyIndices: cJ9,
        supportsPropertyName: lJ9,
        supportedPropertyNames: iJ9,
        indexedGet: nJ9,
        indexedSetNew: rJ9,
        indexedSetExisting: oJ9,
        namedGet: aJ9,
        namedSetNew: sJ9,
        namedSetExisting: tJ9,
        namedDelete: eJ9,
        asyncIteratorNext: AM9,
        asyncIteratorReturn: qM9,
        asyncIteratorInit: KM9,
        asyncIteratorEOI: YM9,
        iteratorResult: UJ9
    }
})
// @from(Ln 191590, Col 4)
Pr7 = x((oh2, Xr7) => {
    var zM9 = /^xn--/,
        _M9 = /[^\0-\x7F]/,
        wM9 = /[\x2E\u3002\uFF0E\uFF61]/g,
        OM9 = {
            overflow: "Overflow: input needs wider integers to process",
            "not-basic": "Illegal input >= 0x80 (not a basic code point)",
            "invalid-input": "Invalid input"
        },
        KB = Math.floor,
        zZ8 = String.fromCharCode;

    function es(A) {
        throw RangeError(OM9[A])
    }

    function $M9(A, q) {
        let K = [],
            Y = A.length;
        while (Y--) K[Y] = q(A[Y]);
        return K
    }

    function Hr7(A, q) {
        let K = A.split("@"),
            Y = "";
        if (K.length > 1) Y = K[0] + "@", A = K[1];
        A = A.replace(wM9, ".");
        let z = A.split("."),
            _ = $M9(z, q).join(".");
        return Y + _
    }

    function jr7(A) {
        let q = [],
            K = 0,
            Y = A.length;
        while (K < Y) {
            let z = A.charCodeAt(K++);
            if (z >= 55296 && z <= 56319 && K < Y) {
                let _ = A.charCodeAt(K++);
                if ((_ & 64512) == 56320) q.push(((z & 1023) << 10) + (_ & 1023) + 65536);
                else q.push(z), K--
            } else q.push(z)
        }
        return q
    }
    var HM9 = (A) => String.fromCodePoint(...A),
        jM9 = function(A) {
            if (A >= 48 && A < 58) return 26 + (A - 48);
            if (A >= 65 && A < 91) return A - 65;
            if (A >= 97 && A < 123) return A - 97;
            return 36
        },
        $r7 = function(A, q) {
            return A + 22 + 75 * (A < 26) - ((q != 0) << 5)
        },
        Jr7 = function(A, q, K) {
            let Y = 0;
            A = K ? KB(A / 700) : A >> 1, A += KB(A / q);
            for (; A > 455; Y += 36) A = KB(A / 35);
            return KB(Y + 36 * A / (A + 38))
        },
        Mr7 = function(A) {
            let q = [],
                K = A.length,
                Y = 0,
                z = 128,
                _ = 72,
                w = A.lastIndexOf("-");
            if (w < 0) w = 0;
            for (let O = 0; O < w; ++O) {
                if (A.charCodeAt(O) >= 128) es("not-basic");
                q.push(A.charCodeAt(O))
            }
            for (let O = w > 0 ? w + 1 : 0; O < K;) {
                let $ = Y;
                for (let j = 1, J = 36;; J += 36) {
                    if (O >= K) es("invalid-input");
                    let M = jM9(A.charCodeAt(O++));
                    if (M >= 36) es("invalid-input");
                    if (M > KB((2147483647 - Y) / j)) es("overflow");
                    Y += M * j;
                    let D = J <= _ ? 1 : J >= _ + 26 ? 26 : J - _;
                    if (M < D) break;
                    let X = 36 - D;
                    if (j > KB(2147483647 / X)) es("overflow");
                    j *= X
                }
                let H = q.length + 1;
                if (_ = Jr7(Y - $, H, $ == 0), KB(Y / H) > 2147483647 - z) es("overflow");
                z += KB(Y / H), Y %= H, q.splice(Y++, 0, z)
            }
            return String.fromCodePoint(...q)
        },
        Dr7 = function(A) {
            let q = [];
            A = jr7(A);
            let K = A.length,
                Y = 128,
                z = 0,
                _ = 72;
            for (let $ of A)
                if ($ < 128) q.push(zZ8($));
            let w = q.length,
                O = w;
            if (w) q.push("-");
            while (O < K) {
                let $ = 2147483647;
                for (let j of A)
                    if (j >= Y && j < $) $ = j;
                let H = O + 1;
                if ($ - Y > KB((2147483647 - z) / H)) es("overflow");
                z += ($ - Y) * H, Y = $;
                for (let j of A) {
                    if (j < Y && ++z > 2147483647) es("overflow");
                    if (j === Y) {
                        let J = z;
                        for (let M = 36;; M += 36) {
                            let D = M <= _ ? 1 : M >= _ + 26 ? 26 : M - _;
                            if (J < D) break;
                            let X = J - D,
                                P = 36 - D;
                            q.push(zZ8($r7(D + X % P, 0))), J = KB(X / P)
                        }
                        q.push(zZ8($r7(J, 0))), _ = Jr7(z, H, O === w), z = 0, ++O
                    }
                }++z, ++Y
            }
            return q.join("")
        },
        JM9 = function(A) {
            return Hr7(A, function(q) {
                return zM9.test(q) ? Mr7(q.slice(4).toLowerCase()) : q
            })
        },
        MM9 = function(A) {
            return Hr7(A, function(q) {
                return _M9.test(q) ? "xn--" + Dr7(q) : q
            })
        },
        DM9 = {
            version: "2.3.1",
            ucs2: {
                decode: jr7,
                encode: HM9
            },
            decode: Mr7,
            encode: Dr7,
            toASCII: MM9,
            toUnicode: JM9
        };
    Xr7.exports = DM9
})