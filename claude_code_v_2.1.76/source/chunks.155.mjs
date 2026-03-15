
// @from(Ln 396190, Col 0)
async function Tn6(A, q, {
    preserveStepUpState: K = !1
} = {}) {
    let Y = U2(),
        z = Y.read();
    if (!z?.mcpOAuth) return;
    let _ = l0(A, q),
        w = z.mcpOAuth[_];
    if (w?.accessToken || w?.refreshToken) try {
        let O = await DL1(q.url, q.oauth?.authServerMetadataUrl);
        if (!O) n1(A, "No OAuth metadata found");
        else {
            let $ = "revocation_endpoint" in O ? O.revocation_endpoint : null;
            if (!$) n1(A, "Server does not support token revocation");
            else {
                let H = String($);
                if (n1(A, `Revoking tokens via ${H}`), w.refreshToken) try {
                    await S2q({
                        serverName: A,
                        endpoint: H,
                        token: w.refreshToken,
                        tokenTypeHint: "refresh_token",
                        clientId: w.clientId,
                        accessToken: w.accessToken
                    })
                } catch (j) {
                    n1(A, `Failed to revoke refresh token: ${_1(j)}`)
                }
                if (w.accessToken) try {
                    await S2q({
                        serverName: A,
                        endpoint: H,
                        token: w.accessToken,
                        tokenTypeHint: "access_token",
                        clientId: w.clientId,
                        accessToken: w.accessToken
                    })
                } catch (j) {
                    n1(A, `Failed to revoke access token: ${_1(j)}`)
                }
            }
        }
    } catch (O) {
        n1(A, `Failed to revoke tokens: ${_1(O)}`)
    } else n1(A, "No tokens to revoke");
    if (XL1(A, q), K && w && (w.stepUpScope || w.discoveryState)) {
        let O = Y.read() || {},
            $ = {
                ...O,
                mcpOAuth: {
                    ...O.mcpOAuth,
                    [_]: {
                        ...O.mcpOAuth?.[_],
                        serverName: A,
                        serverUrl: q.url,
                        accessToken: O.mcpOAuth?.[_]?.accessToken ?? "",
                        expiresAt: O.mcpOAuth?.[_]?.expiresAt ?? 0,
                        ...w.stepUpScope ? {
                            stepUpScope: w.stepUpScope
                        } : {},
                        ...w.discoveryState ? {
                            discoveryState: {
                                authorizationServerUrl: w.discoveryState.authorizationServerUrl,
                                resourceMetadataUrl: w.discoveryState.resourceMetadataUrl
                            }
                        } : {}
                    }
                }
            };
        Y.update($), n1(A, "Preserved step-up auth state across revocation")
    }
}
// @from(Ln 396263, Col 0)
function XL1(A, q) {
    let K = U2(),
        Y = K.read();
    if (!Y?.mcpOAuth) return;
    let z = l0(A, q);
    if (Y.mcpOAuth[z]) delete Y.mcpOAuth[z], K.update(Y), n1(A, "Cleared stored tokens")
}
// @from(Ln 396270, Col 0)
async function mv6(A, q, K, Y, z) {
    let _ = U2(),
        w = l0(A, q),
        O = _.read()?.mcpOAuth?.[w],
        $ = O?.stepUpScope,
        H = O?.discoveryState?.resourceMetadataUrl;
    XL1(A, q);
    let j;
    if (H) try {
        j = new URL(H)
    } catch {
        n1(A, `Invalid cached resourceMetadataUrl: ${H}`)
    }
    let J = {
        scope: $,
        resourceMetadataUrl: j
    };
    d("tengu_mcp_oauth_flow_start", {
        isOAuthFlow: !0,
        transportType: q.type,
        ...Uj(q) ? {
            mcpServerBaseUrl: Uj(q)
        } : {}
    });
    let M = q.oauth?.callbackPort,
        D = M ?? await BlY(),
        X = b2q(D);
    n1(A, `Using redirect port: ${D}${M?" (from config)":""}`);
    let P = new q_6(A, q, X, !0, K, z?.skipBrowserOpen);
    try {
        let V = await DL1(q.url, q.oauth?.authServerMetadataUrl);
        if (V) P.setMetadata(V), n1(A, `Fetched OAuth metadata with scope: ${gU8(V)||"NONE"}`)
    } catch (V) {
        n1(A, `Failed to fetch OAuth metadata: ${_1(V)}`)
    }
    let W = await P.state(),
        Z = null,
        G = null,
        f = null,
        v = () => {
            if (Z) Z.close(), Z = null;
            if (G) clearTimeout(G), G = null;
            if (Y && f) Y.removeEventListener("abort", f), f = null;
            n1(A, "MCP OAuth server cleaned up")
        },
        N = await new Promise((V, L) => {
            let h = !1,
                R = (I) => {
                    if (h) return;
                    h = !0, V(I)
                },
                u = (I) => {
                    if (h) return;
                    h = !0, L(I)
                };
            if (Y) {
                if (f = () => {
                        v(), u(new uv6)
                    }, Y.aborted) {
                    f();
                    return
                }
                Y.addEventListener("abort", f)
            }
            if (z?.onWaitingForCallback) z.onWaitingForCallback((I) => {
                try {
                    let g = new URL(I),
                        B = g.searchParams.get("code"),
                        b = g.searchParams.get("state"),
                        p = g.searchParams.get("error");
                    if (p) {
                        let Q = g.searchParams.get("error_description") || "";
                        v(), u(Error(`OAuth error: ${p} - ${Q}`));
                        return
                    }
                    if (!B) return;
                    if (b !== W) {
                        v(), u(Error("OAuth state mismatch - possible CSRF attack"));
                        return
                    }
                    n1(A, "Received auth code via manual callback URL"), v(), R(B)
                } catch {}
            });
            Z = uU8((I, g) => {
                let B = LlY(I.url || "", !0);
                if (B.pathname === "/callback") {
                    let b = B.query.code,
                        p = B.query.state,
                        Q = B.query.error,
                        U = B.query.error_description,
                        r = B.query.error_uri;
                    if (!Q && p !== W) {
                        g.writeHead(400, {
                            "Content-Type": "text/html"
                        }), g.end("<h1>Authentication Error</h1><p>Invalid state parameter. Please try again.</p><p>You can close this window.</p>"), v(), u(Error("OAuth state mismatch - possible CSRF attack"));
                        return
                    }
                    if (Q) {
                        g.writeHead(200, {
                            "Content-Type": "text/html"
                        });
                        let e = mU8.default(String(Q)),
                            Y6 = U ? mU8.default(String(U)) : "";
                        g.end(`<h1>Authentication Error</h1><p>${e}: ${Y6}</p><p>You can close this window.</p>`), v();
                        let H6 = `OAuth error: ${Q}`;
                        if (U) H6 += ` - ${U}`;
                        if (r) H6 += ` (See: ${r})`;
                        u(Error(H6));
                        return
                    }
                    if (b) g.writeHead(200, {
                        "Content-Type": "text/html"
                    }), g.end("<h1>Authentication Successful</h1><p>You can close this window. Return to Claude Code.</p>"), v(), R(b)
                }
            }), Z.on("error", (I) => {
                if (v(), I.code === "EADDRINUSE") {
                    let g = y8() === "windows" ? `netstat -ano | findstr :${D}` : `lsof -ti:${D} -sTCP:LISTEN`;
                    u(Error(`OAuth callback port ${D} is already in use — another process may be holding it. ` + `Run \`${g}\` to find it.`))
                } else u(Error(`OAuth callback server failed: ${I.message}`))
            }), Z.listen(D, async () => {
                try {
                    n1(A, "Starting SDK auth"), n1(A, `Server URL: ${q.url}`);
                    let I = await CL(P, {
                        serverUrl: q.url,
                        scope: J.scope,
                        resourceMetadataUrl: J.resourceMetadataUrl
                    });
                    if (n1(A, `Initial auth result: ${I}`), I !== "REDIRECT") n1(A, `Unexpected auth result, expected REDIRECT: ${I}`)
                } catch (I) {
                    n1(A, `SDK auth error: ${I}`), v(), u(I instanceof Error ? I : Error(String(I)))
                }
            }), Z.unref(), G = setTimeout((I, g) => {
                I(), g(Error("Authentication timeout"))
            }, 300000, v, u), G.unref()
        });
    try {
        n1(A, "Completing auth flow with authorization code");
        let V = await CL(P, {
            serverUrl: q.url,
            authorizationCode: N,
            resourceMetadataUrl: J.resourceMetadataUrl
        });
        if (n1(A, `Auth result: ${V}`), V === "AUTHORIZED") {
            let L = await P.tokens();
            if (n1(A, `Tokens after auth: ${L?"Present":"Missing"}`), L) n1(A, `Token access_token length: ${L.access_token?.length}`), n1(A, `Token expires_in: ${L.expires_in}`);
            d("tengu_mcp_oauth_flow_success", {
                transportType: q.type,
                ...Uj(q) ? {
                    mcpServerBaseUrl: Uj(q)
                } : {}
            })
        } else throw Error("Unexpected auth result: " + V)
    } catch (V) {
        if (n1(A, `Error during auth completion: ${V}`), X8.isAxiosError(V)) try {
            let L = rx6.parse(V.response?.data);
            if (L.error === "invalid_client" && L.error_description?.includes("Client not found")) {
                let h = U2(),
                    R = h.read() || {},
                    u = l0(A, q);
                if (R.mcpOAuth?.[u]) delete R.mcpOAuth[u].clientId, delete R.mcpOAuth[u].clientSecret, h.update(R)
            }
        } catch {}
        throw d("tengu_mcp_oauth_flow_error", {
            transportType: q.type,
            ...Uj(q) ? {
                mcpServerBaseUrl: Uj(q)
            } : {}
        }), V
    }
}
// @from(Ln 396440, Col 0)
class q_6 {
    serverName;
    serverConfig;
    redirectUri;
    handleRedirection;
    _codeVerifier;
    _authorizationUrl;
    _state;
    _scopes;
    _metadata;
    _refreshInProgress;
    onAuthorizationUrlCallback;
    skipBrowserOpen;
    constructor(A, q, K = b2q(), Y = !1, z, _) {
        this.serverName = A, this.serverConfig = q, this.redirectUri = K, this.handleRedirection = Y, this.onAuthorizationUrlCallback = z, this.skipBrowserOpen = _ ?? !1
    }
    get redirectUrl() {
        return this.redirectUri
    }
    get authorizationUrl() {
        return this._authorizationUrl
    }
    get clientMetadata() {
        let A = {
                client_name: `Claude Code (${this.serverName})`,
                redirect_uris: [this.redirectUri],
                grant_types: ["authorization_code", "refresh_token"],
                response_types: ["code"],
                token_endpoint_auth_method: "none"
            },
            q = gU8(this._metadata);
        if (q) A.scope = q, n1(this.serverName, `Using scope from metadata: ${A.scope}`);
        return A
    }
    setMetadata(A) {
        this._metadata = A
    }
    async state() {
        if (!this._state) this._state = hlY(32).toString("base64url"), n1(this.serverName, "Generated new OAuth state");
        return this._state
    }
    async clientInformation() {
        let q = U2().read(),
            K = l0(this.serverName, this.serverConfig),
            Y = q?.mcpOAuth?.[K];
        if (Y?.clientId) return n1(this.serverName, "Found client info"), {
            client_id: Y.clientId,
            client_secret: Y.clientSecret
        };
        let z = this.serverConfig.oauth?.clientId;
        if (z) {
            let _ = q?.mcpOAuthClientConfig?.[K];
            return n1(this.serverName, "Using pre-configured client ID"), {
                client_id: z,
                client_secret: _?.clientSecret
            }
        }
        n1(this.serverName, "No client info found");
        return
    }
    async saveClientInformation(A) {
        let q = U2(),
            K = q.read() || {},
            Y = l0(this.serverName, this.serverConfig),
            z = {
                ...K,
                mcpOAuth: {
                    ...K.mcpOAuth,
                    [Y]: {
                        ...K.mcpOAuth?.[Y],
                        serverName: this.serverName,
                        serverUrl: this.serverConfig.url,
                        clientId: A.client_id,
                        clientSecret: A.client_secret,
                        accessToken: K.mcpOAuth?.[Y]?.accessToken || "",
                        expiresAt: K.mcpOAuth?.[Y]?.expiresAt || 0
                    }
                }
            };
        q.update(z)
    }
    async tokens() {
        let q = await U2().readAsync(),
            K = l0(this.serverName, this.serverConfig),
            Y = q?.mcpOAuth?.[K];
        if (!Y) {
            n1(this.serverName, "No token data found");
            return
        }
        let z = (Y.expiresAt - Date.now()) / 1000;
        if (z <= 0 && !Y.refreshToken) {
            n1(this.serverName, "Token expired without refresh token");
            return
        }
        if (z <= 300 && Y.refreshToken) {
            if (!this._refreshInProgress) n1(this.serverName, `Token expires in ${Math.floor(z)}s, attempting proactive refresh`), this._refreshInProgress = this.refreshAuthorization(Y.refreshToken).finally(() => {
                this._refreshInProgress = void 0
            });
            else n1(this.serverName, "Token refresh already in progress, reusing existing promise");
            try {
                let w = await this._refreshInProgress;
                if (w) return n1(this.serverName, "Token refreshed successfully"), w;
                n1(this.serverName, "Token refresh failed, returning current tokens")
            } catch (w) {
                n1(this.serverName, `Token refresh error: ${_1(w)}`)
            }
        }
        let _ = {
            access_token: Y.accessToken,
            refresh_token: Y.refreshToken,
            expires_in: z,
            scope: Y.scope,
            token_type: "Bearer"
        };
        return n1(this.serverName, "Returning tokens"), n1(this.serverName, `Token length: ${_.access_token?.length}`), n1(this.serverName, `Has refresh token: ${!!_.refresh_token}`), n1(this.serverName, `Expires in: ${Math.floor(z)}s`), _
    }
    async saveTokens(A) {
        let q = U2(),
            K = q.read() || {},
            Y = l0(this.serverName, this.serverConfig);
        n1(this.serverName, "Saving tokens"), n1(this.serverName, `Token expires in: ${A.expires_in}`), n1(this.serverName, `Has refresh token: ${!!A.refresh_token}`);
        let z = {
            ...K,
            mcpOAuth: {
                ...K.mcpOAuth,
                [Y]: {
                    ...K.mcpOAuth?.[Y],
                    serverName: this.serverName,
                    serverUrl: this.serverConfig.url,
                    accessToken: A.access_token,
                    refreshToken: A.refresh_token,
                    expiresAt: Date.now() + (A.expires_in || 3600) * 1000,
                    scope: A.scope
                }
            }
        };
        q.update(z)
    }
    async redirectToAuthorization(A) {
        this._authorizationUrl = A.toString();
        let q = A.searchParams.get("scope");
        if (n1(this.serverName, `Authorization URL: ${R2q(A.toString())}`), n1(this.serverName, `Scopes in URL: ${q||"NOT FOUND"}`), q) this._scopes = q, n1(this.serverName, `Captured scopes from authorization URL: ${q}`);
        else {
            let z = gU8(this._metadata);
            if (z) this._scopes = z, n1(this.serverName, `Using scopes from metadata: ${z}`);
            else n1(this.serverName, "No scopes available from URL or metadata")
        }
        if (this._scopes && !this.handleRedirection) {
            let z = U2(),
                _ = z.read() || {},
                w = l0(this.serverName, this.serverConfig),
                O = _.mcpOAuth?.[w];
            if (O) O.stepUpScope = this._scopes, z.update(_), n1(this.serverName, `Persisted step-up scope: ${this._scopes}`)
        }
        if (!this.handleRedirection) {
            n1(this.serverName, "Redirection handling is disabled, skipping redirect");
            return
        }
        let K = A.toString();
        if (!K.startsWith("http://") && !K.startsWith("https://")) throw Error("Invalid authorization URL: must use http:// or https:// scheme");
        n1(this.serverName, "Redirecting to authorization URL");
        let Y = R2q(K);
        if (n1(this.serverName, `Authorization URL: ${Y}`), this.onAuthorizationUrlCallback) this.onAuthorizationUrlCallback(K);
        if (!this.skipBrowserOpen) {
            if (n1(this.serverName, `Opening authorization URL: ${Y}`), !await R9(K)) n1(this.serverName, "Browser didn't open automatically. URL is shown in UI.")
        } else n1(this.serverName, `Skipping browser open (skipBrowserOpen=true). URL: ${Y}`)
    }
    async saveCodeVerifier(A) {
        n1(this.serverName, "Saving code verifier"), this._codeVerifier = A
    }
    async codeVerifier() {
        if (!this._codeVerifier) throw n1(this.serverName, "No code verifier saved"), Error("No code verifier saved");
        return n1(this.serverName, "Returning code verifier"), this._codeVerifier
    }
    async invalidateCredentials(A) {
        let q = U2(),
            K = q.read();
        if (!K?.mcpOAuth) return;
        let Y = l0(this.serverName, this.serverConfig),
            z = K.mcpOAuth[Y];
        if (!z) return;
        switch (A) {
            case "all":
                delete K.mcpOAuth[Y];
                break;
            case "client":
                z.clientId = void 0, z.clientSecret = void 0;
                break;
            case "tokens":
                z.accessToken = "", z.refreshToken = void 0, z.expiresAt = 0;
                break;
            case "verifier":
                this._codeVerifier = void 0;
                return;
            case "discovery":
                z.discoveryState = void 0, z.stepUpScope = void 0;
                break
        }
        q.update(K), n1(this.serverName, `Invalidated credentials (scope: ${A})`)
    }
    async saveDiscoveryState(A) {
        let q = U2(),
            K = q.read() || {},
            Y = l0(this.serverName, this.serverConfig);
        n1(this.serverName, `Saving discovery state (authServer: ${A.authorizationServerUrl})`);
        let z = {
            ...K,
            mcpOAuth: {
                ...K.mcpOAuth,
                [Y]: {
                    ...K.mcpOAuth?.[Y],
                    serverName: this.serverName,
                    serverUrl: this.serverConfig.url,
                    accessToken: K.mcpOAuth?.[Y]?.accessToken || "",
                    expiresAt: K.mcpOAuth?.[Y]?.expiresAt || 0,
                    discoveryState: {
                        authorizationServerUrl: A.authorizationServerUrl,
                        resourceMetadataUrl: A.resourceMetadataUrl
                    }
                }
            }
        };
        q.update(z)
    }
    async discoveryState() {
        let q = U2().read(),
            K = l0(this.serverName, this.serverConfig),
            Y = q?.mcpOAuth?.[K]?.discoveryState;
        if (Y?.authorizationServerUrl) return n1(this.serverName, `Returning cached discovery state (authServer: ${Y.authorizationServerUrl})`), {
            authorizationServerUrl: Y.authorizationServerUrl,
            resourceMetadataUrl: Y.resourceMetadataUrl,
            resourceMetadata: Y.resourceMetadata,
            authorizationServerMetadata: Y.authorizationServerMetadata
        };
        let z = this.serverConfig.oauth?.authServerMetadataUrl;
        if (z) {
            n1(this.serverName, `Fetching metadata from configured URL: ${z}`);
            try {
                let _ = await DL1(this.serverConfig.url, z);
                if (_) return {
                    authorizationServerUrl: _.issuer,
                    authorizationServerMetadata: _
                }
            } catch (_) {
                n1(this.serverName, `Failed to fetch from configured metadata URL: ${_1(_)}`)
            }
        }
        return
    }
    async refreshAuthorization(A) {
        let q = l0(this.serverName, this.serverConfig),
            K = c8();
        await SlY(K, {
            recursive: !0
        });
        let Y = q.replace(/[^a-zA-Z0-9]/g, "_"),
            z = ClY(K, `mcp-refresh-${Y}.lock`),
            _;
        for (let w = 0; w < xU8; w++) try {
            n1(this.serverName, `Acquiring refresh lock (attempt ${w+1})`), _ = await C2q.lock(z, {
                realpath: !1,
                onCompromised: () => {
                    n1(this.serverName, "Refresh lock was compromised")
                }
            }), n1(this.serverName, "Acquired refresh lock");
            break
        } catch (O) {
            let $ = O.code;
            if ($ === "ELOCKED") {
                n1(this.serverName, `Refresh lock held by another process, waiting (attempt ${w+1}/${xU8})`), await new Promise((H) => setTimeout(H, 1000 + Math.random() * 1000));
                continue
            }
            n1(this.serverName, `Failed to acquire refresh lock: ${$}, proceeding without lock`);
            break
        }
        if (!_) n1(this.serverName, `Could not acquire refresh lock after ${xU8} retries, proceeding without lock`);
        try {
            tV();
            let $ = U2().read()?.mcpOAuth?.[q];
            if ($) {
                let H = ($.expiresAt - Date.now()) / 1000;
                if (H > 300) return n1(this.serverName, `Another process already refreshed tokens (expires in ${Math.floor(H)}s)`), {
                    access_token: $.accessToken,
                    refresh_token: $.refreshToken,
                    expires_in: H,
                    scope: $.scope,
                    token_type: "Bearer"
                };
                if ($.refreshToken) A = $.refreshToken
            }
            return await this._doRefresh(A)
        } finally {
            if (_) try {
                await _(), n1(this.serverName, "Released refresh lock")
            } catch {
                n1(this.serverName, "Failed to release refresh lock")
            }
        }
    }
    async _doRefresh(A) {
        let K = Uj(this.serverConfig),
            Y = (z, _) => {
                d(z === "success" ? "tengu_mcp_oauth_refresh_success" : "tengu_mcp_oauth_refresh_failure", {
                    transportType: this.serverConfig.type,
                    ...K ? {
                        mcpServerBaseUrl: K
                    } : {},
                    ..._ ? {
                        reason: _
                    } : {}
                })
            };
        for (let z = 1; z <= 3; z++) try {
            n1(this.serverName, "Starting token refresh");
            let _ = I2q(),
                w = this._metadata;
            if (!w) {
                let H = await this.discoveryState();
                if (H?.authorizationServerMetadata) n1(this.serverName, "Using persisted auth server metadata for refresh"), w = H.authorizationServerMetadata;
                else if (H?.authorizationServerUrl) n1(this.serverName, `Re-discovering metadata from persisted auth server URL: ${H.authorizationServerUrl}`), w = await ox6(H.authorizationServerUrl, {
                    fetchFn: _
                })
            }
            if (!w) w = await DL1(this.serverConfig.url, this.serverConfig.oauth?.authServerMetadataUrl, _);
            if (!w) {
                n1(this.serverName, "Failed to discover OAuth metadata"), Y("failure", "metadata_discovery_failed");
                return
            }
            this._metadata = w;
            let O = await this.clientInformation();
            if (!O) {
                n1(this.serverName, "No client information available"), Y("failure", "no_client_info");
                return
            }
            let $ = await tO8(new URL(this.serverConfig.url), {
                metadata: w,
                clientInformation: O,
                refreshToken: A,
                resource: new URL(this.serverConfig.url),
                fetchFn: _
            });
            if ($) return n1(this.serverName, "Token refresh successful"), await this.saveTokens($), Y("success"), $;
            n1(this.serverName, "Token refresh returned no tokens"), Y("failure", "no_tokens_returned");
            return
        } catch (_) {
            if (_ instanceof sa) {
                n1(this.serverName, `Token refresh failed with invalid_grant: ${_.message}`), tV();
                let J = U2().read(),
                    M = l0(this.serverName, this.serverConfig),
                    D = J?.mcpOAuth?.[M];
                if (D) {
                    let X = (D.expiresAt - Date.now()) / 1000;
                    if (X > 300) return n1(this.serverName, "Another process refreshed tokens, using those"), {
                        access_token: D.accessToken,
                        refresh_token: D.refreshToken,
                        expires_in: X,
                        scope: D.scope,
                        token_type: "Bearer"
                    }
                }
                n1(this.serverName, "No valid tokens in storage, clearing stored tokens"), await this.invalidateCredentials("tokens"), Y("failure", "invalid_grant");
                return
            }
            let w = _ instanceof Error && /timeout|timed out|etimedout|econnreset/i.test(_.message),
                O = _ instanceof Dm || _ instanceof FD6 || _ instanceof pD6,
                $ = w || O;
            if (!$ || z >= 3) {
                n1(this.serverName, `Token refresh failed: ${_1(_)}`), Y("failure", $ ? "transient_retries_exhausted" : "request_failed");
                return
            }
            let H = 1000 * Math.pow(2, z - 1);
            n1(this.serverName, `Token refresh failed, retrying in ${H}ms (attempt ${z}/3)`), await new Promise((j) => setTimeout(j, H))
        }
        return
    }
}
// @from(Ln 396816, Col 0)
async function vn6() {
    let A = process.env.MCP_CLIENT_SECRET;
    if (A) return A;
    if (!process.stdin.isTTY) throw Error("No TTY available to prompt for client secret. Set MCP_CLIENT_SECRET env var instead.");
    return new Promise((q, K) => {
        process.stderr.write("Enter OAuth client secret: "), process.stdin.setRawMode?.(!0);
        let Y = "",
            z = (_) => {
                let w = _.toString();
                if (w === `
` || w === "\r") process.stdin.setRawMode?.(!1), process.stdin.removeListener("data", z), process.stderr.write(`
`), q(Y);
                else if (w === "\x03") process.stdin.setRawMode?.(!1), process.stdin.removeListener("data", z), K(Error("Cancelled"));
                else if (w === "" || w === "\b") Y = Y.slice(0, -1);
                else Y += w
            };
        process.stdin.on("data", z)
    })
}
// @from(Ln 396836, Col 0)
function Nn6(A, q, K) {
    let Y = U2(),
        z = Y.read() || {},
        _ = l0(A, q);
    Y.update({
        ...z,
        mcpOAuthClientConfig: {
            ...z.mcpOAuthClientConfig,
            [_]: {
                clientSecret: K
            }
        }
    })
}
// @from(Ln 396851, Col 0)
function x2q(A, q) {
    let K = U2(),
        Y = K.read();
    if (!Y?.mcpOAuthClientConfig) return;
    let z = l0(A, q);
    if (Y.mcpOAuthClientConfig[z]) delete Y.mcpOAuthClientConfig[z], K.update(Y)
}
// @from(Ln 396859, Col 0)
function FU8(A, q) {
    let Y = U2().read(),
        z = l0(A, q);
    return Y?.mcpOAuthClientConfig?.[z]
}
// @from(Ln 396865, Col 0)
function gU8(A) {
    if (!A) return;
    if ("scope" in A && typeof A.scope === "string") return A.scope;
    if ("default_scope" in A && typeof A.default_scope === "string") return A.default_scope;
    if (A.scopes_supported && Array.isArray(A.scopes_supported)) return A.scopes_supported.join(" ");
    return
}
// @from(Ln 396872, Col 4)
mU8
// @from(Ln 396872, Col 9)
C2q
// @from(Ln 396872, Col 14)
IlY = 30000
// @from(Ln 396873, Col 4)
xU8 = 5
// @from(Ln 396874, Col 4)
blY
// @from(Ln 396874, Col 9)
xlY
// @from(Ln 396874, Col 14)
uv6
// @from(Ln 396874, Col 19)
ulY
// @from(Ln 396874, Col 24)
BU8 = 3118
// @from(Ln 396875, Col 4)
W16 = E(() => {
    aI6();
    V1();
    jw1();
    ax6();
    iO8();
    kX();
    kK();
    k1();
    qM();
    YK();
    Gq6();
    A8();
    g1();
    s8();
    mU8 = t(L2q(), 1), C2q = t(nx(), 1), blY = ["state", "nonce", "code_challenge", "code_verifier", "code"];
    xlY = new Set(["invalid_refresh_token", "expired_refresh_token", "token_expired"]);
    uv6 = class uv6 extends Error {
        constructor() {
            super("Authentication was cancelled");
            this.name = "AuthenticationCancelledError"
        }
    };
    ulY = y8() === "windows" ? {
        min: 39152,
        max: 49151
    } : {
        min: 49152,
        max: 65535
    }
})
// @from(Ln 396907, Col 0)
function m2q(A) {
    switch (A) {
        case "project":
            return {
                label: "Project MCPs", path: PZ(A)
            };
        case "user":
            return {
                label: "User MCPs", path: PZ(A)
            };
        case "local":
            return {
                label: "Local MCPs", path: PZ(A)
            };
        case "enterprise":
            return {
                label: "Enterprise MCPs"
            };
        case "dynamic":
            return {
                label: "Built-in MCPs", path: "always available"
            };
        default:
            return {
                label: A
            }
    }
}
// @from(Ln 396936, Col 0)
function glY(A) {
    let q = new Map;
    for (let K of A) {
        let Y = K.scope;
        if (!q.has(Y)) q.set(Y, []);
        q.get(Y).push(K)
    }
    for (let [, K] of q) K.sort((Y, z) => Y.name.localeCompare(z.name));
    return q
}
// @from(Ln 396947, Col 0)
function pU8(A) {
    let q = A6(76),
        {
            servers: K,
            agentServers: Y,
            onSelectServer: z,
            onSelectAgentServer: _,
            onComplete: w
        } = A,
        O;
    if (q[0] !== Y) O = Y === void 0 ? [] : Y, q[0] = Y, q[1] = O;
    else O = q[1];
    let $ = O,
        [H] = z7(),
        [j, J] = C5.useState(0),
        M;
    if (q[2] !== K) {
        let R6 = K.filter(clY);
        M = glY(R6), q[2] = K, q[3] = M
    } else M = q[3];
    let D = M,
        X;
    if (q[4] !== K) X = K.filter(dlY).sort(UlY), q[4] = K, q[5] = X;
    else X = q[5];
    let P = X,
        W;
    if (q[6] !== D) W = (D.get("dynamic") ?? []).sort(QlY), q[6] = D, q[7] = W;
    else W = q[7];
    let Z = W,
        G;
    if (q[8] === Symbol.for("react.memo_cache_sentinel")) G = m2q("dynamic"), q[8] = G;
    else G = q[8];
    let f = G,
        v;
    if (q[9] !== $ || q[10] !== P || q[11] !== Z || q[12] !== D) {
        v = [];
        for (let R6 of u2q) {
            let T6 = D.get(R6) ?? [];
            for (let D6 of T6) v.push({
                type: "server",
                server: D6
            })
        }
        for (let R6 of P) v.push({
            type: "server",
            server: R6
        });
        for (let R6 of $) v.push({
            type: "agent-server",
            agentServer: R6
        });
        for (let R6 of Z) v.push({
            type: "server",
            server: R6
        });
        q[9] = $, q[10] = P, q[11] = Z, q[12] = D, q[13] = v
    } else v = q[13];
    let N = v,
        V;
    if (q[14] !== w) V = () => {
        w("MCP dialog dismissed", {
            display: "system"
        })
    }, q[14] = w, q[15] = V;
    else V = q[15];
    let L = V,
        h;
    if (q[16] !== _ || q[17] !== z || q[18] !== N || q[19] !== j) h = () => {
        let R6 = N[j];
        if (!R6) return;
        if (R6.type === "server") z(R6.server);
        else if (R6.type === "agent-server" && _) _(R6.agentServer)
    }, q[16] = _, q[17] = z, q[18] = N, q[19] = j, q[20] = h;
    else h = q[20];
    let R = h,
        u, I;
    if (q[21] !== N) I = () => J((R6) => R6 === 0 ? N.length - 1 : R6 - 1), u = () => J((R6) => R6 === N.length - 1 ? 0 : R6 + 1), q[21] = N, q[22] = u, q[23] = I;
    else u = q[22], I = q[23];
    let g;
    if (q[24] !== L || q[25] !== R || q[26] !== u || q[27] !== I) g = {
        "confirm:previous": I,
        "confirm:next": u,
        "confirm:yes": R,
        "confirm:no": L
    }, q[24] = L, q[25] = R, q[26] = u, q[27] = I, q[28] = g;
    else g = q[28];
    let B;
    if (q[29] === Symbol.for("react.memo_cache_sentinel")) B = {
        context: "Confirmation"
    }, q[29] = B;
    else B = q[29];
    tA(g, B);
    let b;
    if (q[30] !== N) b = (R6) => N.findIndex((T6) => T6.type === "server" && T6.server === R6), q[30] = N, q[31] = b;
    else b = q[31];
    let p = b,
        Q;
    if (q[32] !== N) Q = (R6) => N.findIndex((T6) => T6.type === "agent-server" && T6.agentServer === R6), q[32] = N, q[33] = Q;
    else Q = q[33];
    let U = Q,
        r;
    if (q[34] === Symbol.for("react.memo_cache_sentinel")) r = PT(), q[34] = r;
    else r = q[34];
    let e = r,
        Y6;
    if (q[35] !== K) Y6 = K.some(plY), q[35] = K, q[36] = Y6;
    else Y6 = q[36];
    let H6 = Y6;
    if (K.length === 0 && $.length === 0) return null;
    let J6;
    if (q[37] !== p || q[38] !== j || q[39] !== H) J6 = (R6) => {
        let T6 = p(R6),
            D6 = j === T6,
            Q6, k6;
        if (R6.client.type === "disabled") Q6 = kA("inactive", H)(a6.radioOff), k6 = "disabled";
        else if (R6.client.type === "connected") Q6 = kA("success", H)(a6.tick), k6 = "connected";
        else if (R6.client.type === "pending") {
            Q6 = kA("inactive", H)(a6.radioOff);
            let {
                reconnectAttempt: Z6,
                maxReconnectAttempts: u6
            } = R6.client;
            if (Z6 && u6) k6 = `reconnecting (${Z6}/${u6})…`;
            else k6 = "connecting…"
        } else if (R6.client.type === "needs-auth") Q6 = kA("warning", H)(a6.triangleUpOutline), k6 = "needs authentication";
        else Q6 = kA("error", H)(a6.cross), k6 = "failed";
        return C5.default.createElement(m, {
            key: `${R6.name}-${T6}`
        }, C5.default.createElement(T, {
            color: D6 ? "suggestion" : void 0
        }, D6 ? `${a6.pointer} ` : "  "), C5.default.createElement(T, {
            color: D6 ? "suggestion" : void 0
        }, R6.name), C5.default.createElement(T, {
            dimColor: !D6
        }, " · ", Q6, " "), C5.default.createElement(T, {
            dimColor: !D6
        }, k6))
    }, q[37] = p, q[38] = j, q[39] = H, q[40] = J6;
    else J6 = q[40];
    let K6 = J6,
        s;
    if (q[41] !== U || q[42] !== j || q[43] !== H) s = (R6) => {
        let T6 = U(R6),
            D6 = j === T6,
            Q6 = R6.needsAuth ? kA("warning", H)(a6.triangleUpOutline) : kA("inactive", H)(a6.radioOff),
            k6 = R6.needsAuth ? "may need auth" : "agent-only";
        return C5.default.createElement(m, {
            key: `agent-${R6.name}-${T6}`
        }, C5.default.createElement(T, {
            color: D6 ? "suggestion" : void 0
        }, D6 ? `${a6.pointer} ` : "  "), C5.default.createElement(T, {
            color: D6 ? "suggestion" : void 0
        }, R6.name), C5.default.createElement(T, {
            dimColor: !D6
        }, " · ", Q6, " "), C5.default.createElement(T, {
            dimColor: !D6
        }, k6))
    }, q[41] = U, q[42] = j, q[43] = H, q[44] = s;
    else s = q[44];
    let X6 = s,
        z6 = K.length + $.length,
        N6;
    if (q[45] === Symbol.for("react.memo_cache_sentinel")) N6 = C5.default.createElement(ry1, null), q[45] = N6;
    else N6 = q[45];
    let $6 = `${z6} server${z6===1?"":"s"}`,
        n;
    if (q[46] !== K6 || q[47] !== D) n = u2q.map((R6) => {
        let T6 = D.get(R6);
        if (!T6 || T6.length === 0) return null;
        let D6 = m2q(R6);
        return C5.default.createElement(m, {
            key: R6,
            flexDirection: "column",
            marginBottom: 1
        }, C5.default.createElement(m, {
            paddingLeft: 2
        }, C5.default.createElement(T, {
            bold: !0
        }, D6.label), D6.path && C5.default.createElement(T, {
            dimColor: !0
        }, " (", D6.path, ")")), T6.map((Q6) => K6(Q6)))
    }), q[46] = K6, q[47] = D, q[48] = n;
    else n = q[48];
    let o;
    if (q[49] !== P || q[50] !== K6) o = P.length > 0 && C5.default.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, C5.default.createElement(m, {
        paddingLeft: 2
    }, C5.default.createElement(T, {
        bold: !0
    }, "claude.ai")), P.map((R6) => K6(R6))), q[49] = P, q[50] = K6, q[51] = o;
    else o = q[51];
    let a;
    if (q[52] !== $ || q[53] !== X6) a = $.length > 0 && C5.default.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, C5.default.createElement(m, {
        paddingLeft: 2
    }, C5.default.createElement(T, {
        bold: !0
    }, "Agent MCPs")), [...new Set($.flatMap(FlY))].map((R6) => C5.default.createElement(m, {
        key: R6,
        flexDirection: "column",
        marginTop: 1
    }, C5.default.createElement(m, {
        paddingLeft: 2
    }, C5.default.createElement(T, {
        dimColor: !0
    }, "@", R6)), $.filter((T6) => T6.sourceAgents.includes(R6)).map((T6) => X6(T6))))), q[52] = $, q[53] = X6, q[54] = a;
    else a = q[54];
    let i;
    if (q[55] !== Z || q[56] !== K6) i = Z.length > 0 && C5.default.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, C5.default.createElement(m, {
        paddingLeft: 2
    }, C5.default.createElement(T, {
        bold: !0
    }, f.label), f.path && C5.default.createElement(T, {
        dimColor: !0
    }, " (", f.path, ")")), Z.map((R6) => K6(R6))), q[55] = Z, q[56] = K6, q[57] = i;
    else i = q[57];
    let l;
    if (q[58] !== H6) l = H6 && C5.default.createElement(T, {
        dimColor: !0
    }, e ? "※ Error logs shown inline with --debug" : "※ Run claude --debug to see error logs"), q[58] = H6, q[59] = l;
    else l = q[59];
    let q6;
    if (q[60] === Symbol.for("react.memo_cache_sentinel")) q6 = C5.default.createElement(T, {
        dimColor: !0
    }, C5.default.createElement(y7, {
        url: "https://code.claude.com/docs/en/mcp"
    }, "https://code.claude.com/docs/en/mcp"), " ", "for help"), q[60] = q6;
    else q6 = q[60];
    let w6;
    if (q[61] !== l) w6 = C5.default.createElement(m, {
        flexDirection: "column"
    }, l, q6), q[61] = l, q[62] = w6;
    else w6 = q[62];
    let O6;
    if (q[63] !== n || q[64] !== o || q[65] !== a || q[66] !== i || q[67] !== w6) O6 = C5.default.createElement(m, {
        flexDirection: "column"
    }, n, o, a, i, w6), q[63] = n, q[64] = o, q[65] = a, q[66] = i, q[67] = w6, q[68] = O6;
    else O6 = q[68];
    let L6;
    if (q[69] !== L || q[70] !== $6 || q[71] !== O6) L6 = C5.default.createElement(m8, {
        title: "Manage MCP servers",
        subtitle: $6,
        onCancel: L,
        hideInputGuide: !0
    }, O6), q[69] = L, q[70] = $6, q[71] = O6, q[72] = L6;
    else L6 = q[72];
    let y6;
    if (q[73] === Symbol.for("react.memo_cache_sentinel")) y6 = C5.default.createElement(m, {
        paddingX: 1
    }, C5.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, C5.default.createElement(C8, null, C5.default.createElement(a1, {
        shortcut: "↑↓",
        action: "navigate"
    }), C5.default.createElement(a1, {
        shortcut: "Enter",
        action: "confirm"
    }), C5.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })))), q[73] = y6;
    else y6 = q[73];
    let G6;
    if (q[74] !== L6) G6 = C5.default.createElement(m, {
        flexDirection: "column"
    }, N6, L6, y6), q[74] = L6, q[75] = G6;
    else G6 = q[75];
    return G6
}
// @from(Ln 397227, Col 0)
function FlY(A) {
    return A.sourceAgents
}
// @from(Ln 397231, Col 0)
function plY(A) {
    return A.client.type === "failed"
}
// @from(Ln 397235, Col 0)
function QlY(A, q) {
    return A.name.localeCompare(q.name)
}
// @from(Ln 397239, Col 0)
function UlY(A, q) {
    return A.name.localeCompare(q.name)
}
// @from(Ln 397243, Col 0)
function dlY(A) {
    return A.client.config.type === "claudeai-proxy"
}
// @from(Ln 397247, Col 0)
function clY(A) {
    return A.client.config.type !== "claudeai-proxy"
}
// @from(Ln 397250, Col 4)
C5
// @from(Ln 397250, Col 8)
u2q
// @from(Ln 397251, Col 4)
QU8 = E(() => {
    e6();
    i6();
    _7();
    H1();
    b7();
    XU8();
    wq();
    Lq();
    OK();
    Xq();
    qM();
    C5 = t(P6(), 1), u2q = ["project", "local", "user", "enterprise"]
})
// @from(Ln 397266, Col 0)
function PL1(A) {
    let q = A6(9),
        {
            serverToolsCount: K,
            serverPromptsCount: Y,
            serverResourcesCount: z
        } = A,
        _;
    if (q[0] !== Y || q[1] !== z || q[2] !== K) {
        if (_ = [], K > 0) _.push("tools");
        if (z > 0) _.push("resources");
        if (Y > 0) _.push("prompts");
        q[0] = Y, q[1] = z, q[2] = K, q[3] = _
    } else _ = q[3];
    let w;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) w = Vn6.default.createElement(T, {
        bold: !0
    }, "Capabilities: "), q[4] = w;
    else w = q[4];
    let O;
    if (q[5] !== _) O = _.length > 0 ? Vn6.default.createElement(C8, null, _) : "none", q[5] = _, q[6] = O;
    else O = q[6];
    let $;
    if (q[7] !== O) $ = Vn6.default.createElement(m, null, w, Vn6.default.createElement(T, {
        color: "text"
    }, O)), q[7] = O, q[8] = $;
    else $ = q[8];
    return $
}
// @from(Ln 397295, Col 4)
Vn6
// @from(Ln 397296, Col 4)
UU8 = E(() => {
    e6();
    i6();
    Xq();
    Vn6 = t(P6(), 1)
})
// @from(Ln 397303, Col 0)
function llY(A, q) {
    return q.length < 2 ? A : Rw6(A, Fw1(q, 0, -1))
}
// @from(Ln 397306, Col 4)
B2q
// @from(Ln 397307, Col 4)
g2q = E(() => {
    Jt6();
    G$8();
    B2q = llY
})
// @from(Ln 397313, Col 0)
function ilY(A, q) {
    return q = kx(q, A), A = B2q(A, q), A == null || delete A[sE(fL(q))]
}
// @from(Ln 397316, Col 4)
F2q
// @from(Ln 397317, Col 4)
p2q = E(() => {
    Lw6();
    eI6();
    g2q();
    l86();
    F2q = ilY
})
// @from(Ln 397325, Col 0)
function nlY(A) {
    return $J6(A) ? void 0 : A
}
// @from(Ln 397328, Col 4)
Q2q
// @from(Ln 397329, Col 4)
U2q = E(() => {
    N31();
    Q2q = nlY
})
// @from(Ln 397334, Col 0)
function rlY(A) {
    return q_(A) || Hp(A) || !!(d2q && A && A[d2q])
}
// @from(Ln 397337, Col 4)
d2q
// @from(Ln 397337, Col 9)
c2q
// @from(Ln 397338, Col 4)
l2q = E(() => {
    p86();
    kk6();
    qG();
    d2q = yD ? yD.isConcatSpreadable : void 0;
    c2q = rlY
})
// @from(Ln 397346, Col 0)
function i2q(A, q, K, Y, z) {
    var _ = -1,
        w = A.length;
    K || (K = c2q), z || (z = []);
    while (++_ < w) {
        var O = A[_];
        if (q > 0 && K(O))
            if (q > 1) i2q(O, q - 1, K, Y, z);
            else Ww6(z, O);
        else if (!Y) z[z.length] = O
    }
    return z
}
// @from(Ln 397359, Col 4)
n2q
// @from(Ln 397360, Col 4)
r2q = E(() => {
    Fs6();
    l2q();
    n2q = i2q
})
// @from(Ln 397366, Col 0)
function olY(A) {
    var q = A == null ? 0 : A.length;
    return q ? n2q(A, 1) : []
}
// @from(Ln 397370, Col 4)
o2q
// @from(Ln 397371, Col 4)
a2q = E(() => {
    r2q();
    o2q = olY
})
// @from(Ln 397376, Col 0)
function alY(A) {
    return k31(V31(A, void 0, o2q), A + "")
}
// @from(Ln 397379, Col 4)
s2q
// @from(Ln 397380, Col 4)
t2q = E(() => {
    a2q();
    A58();
    q58();
    s2q = alY
})
// @from(Ln 397386, Col 4)
slY = 1
// @from(Ln 397387, Col 4)
tlY = 2
// @from(Ln 397388, Col 4)
elY = 4
// @from(Ln 397389, Col 4)
AiY
// @from(Ln 397389, Col 9)
Z16
// @from(Ln 397390, Col 4)
dU8 = E(() => {
    Ht6();
    Hm1();
    p2q();
    Lw6();
    wA6();
    U2q();
    t2q();
    wm1();
    AiY = s2q(function(A, q) {
        var K = {};
        if (A == null) return K;
        var Y = !1;
        if (q = Ew6(q, function(_) {
                return _ = kx(_, A), Y || (Y = _.length > 1), _
            }), tE(A, mt6(A), K), Y) K = Qt6(K, slY | tlY | elY, Q2q);
        var z = q.length;
        while (z--) F2q(K, q[z]);
        return K
    }), Z16 = AiY
})
// @from(Ln 397412, Col 0)
function qiY(A, q) {
    return function(K, Y) {
        if (K == null) return K;
        if (!Vx(K)) return A(K, Y);
        var z = K.length,
            _ = q ? z : -1,
            w = Object(K);
        while (q ? _-- : ++_ < z)
            if (Y(w[_], _, w) === !1) break;
        return K
    }
}
// @from(Ln 397424, Col 4)
e2q
// @from(Ln 397425, Col 4)
Awq = E(() => {
    Nw6();
    e2q = qiY
})
// @from(Ln 397429, Col 4)
KiY
// @from(Ln 397429, Col 9)
WL1
// @from(Ln 397430, Col 4)
cU8 = E(() => {
    Pf8();
    Awq();
    KiY = e2q(JD1), WL1 = KiY
})
// @from(Ln 397436, Col 0)
function YiY(A, q) {
    var K = [];
    return WL1(A, function(Y, z, _) {
        if (q(Y, z, _)) K.push(Y)
    }), K
}
// @from(Ln 397442, Col 4)
qwq
// @from(Ln 397443, Col 4)
Kwq = E(() => {
    cU8();
    qwq = YiY
})
// @from(Ln 397448, Col 0)
function _iY(A) {
    if (typeof A != "function") throw TypeError(ziY);
    return function() {
        var q = arguments;
        switch (q.length) {
            case 0:
                return !A.call(this);
            case 1:
                return !A.call(this, q[0]);
            case 2:
                return !A.call(this, q[0], q[1]);
            case 3:
                return !A.call(this, q[0], q[1], q[2])
        }
        return !A.apply(this, q)
    }
}
// @from(Ln 397465, Col 4)
ziY = "Expected a function"
// @from(Ln 397466, Col 4)
Ywq
// @from(Ln 397467, Col 4)
zwq = E(() => {
    Ywq = _iY
})
// @from(Ln 397471, Col 0)
function wiY(A, q) {
    var K = q_(A) ? Qs6 : qwq;
    return K(A, Ywq(Ex(q, 3)))
}
// @from(Ln 397475, Col 4)
yN
// @from(Ln 397476, Col 4)
lU8 = E(() => {
    bx1();
    Kwq();
    Sw6();
    qG();
    zwq();
    yN = wiY
})
// @from(Ln 397485, Col 0)
function _wq(A) {
    let q = "plugin" in A ? A.plugin : "no-plugin";
    return `${A.type}:${A.source}:${q}`
}
// @from(Ln 397490, Col 0)
function wwq(A, q) {
    if (q.length === 0) return;
    A((K) => {
        let Y = new Set(K.plugins.errors.map((_) => _wq(_))),
            z = q.filter((_) => !Y.has(_wq(_)));
        if (z.length === 0) return K;
        return {
            ...K,
            plugins: {
                ...K.plugins,
                errors: [...K.plugins.errors, ...z]
            }
        }
    })
}
// @from(Ln 397506, Col 0)
function Owq(A, q = !1) {
    let K = S5(),
        Y = M1((G) => G.authVersion),
        z = M1((G) => G.mcp.pluginReconnectKey),
        _ = xA(),
        w = Ff.useRef(new Map),
        O = Ff.useRef(new Set),
        {
            addNotification: $
        } = o4(),
        H = 16,
        j = Ff.useRef([]),
        J = Ff.useRef(null),
        M = Ff.useCallback(() => {
            J.current = null;
            let G = j.current;
            if (G.length === 0) return;
            j.current = [], _((f) => {
                let v = f.mcp;
                for (let N of G) {
                    let {
                        tools: V,
                        commands: L,
                        resources: h,
                        ...R
                    } = N, u = R.type === "disabled" || R.type === "failed" ? V ?? [] : V, I = R.type === "disabled" || R.type === "failed" ? L ?? [] : L, g = R.type === "disabled" || R.type === "failed" ? h ?? [] : h, B = HC(R.name), p = v.clients.findIndex((e) => e.name === R.name) === -1 ? [...v.clients, R] : v.clients.map((e) => e.name === R.name ? R : e), Q = u === void 0 ? v.tools : [...yN(v.tools, (e) => e.name?.startsWith(B)), ...u], U = I === void 0 ? v.commands : [...yN(v.commands, (e) => e.name?.startsWith(B)), ...I], r = g === void 0 ? v.resources : {
                        ...v.resources,
                        ...g.length > 0 ? {
                            [R.name]: g
                        } : Z16(v.resources, R.name)
                    };
                    v = {
                        ...v,
                        clients: p,
                        tools: Q,
                        commands: U,
                        resources: r
                    }
                }
                return {
                    ...f,
                    mcp: v
                }
            })
        }, [_]),
        D = Ff.useCallback((G) => {
            if (j.current.push(G), J.current === null) J.current = setTimeout(M, 16)
        }, [M]),
        X = Ff.useCallback(({
            client: G,
            tools: f,
            commands: v,
            resources: N
        }) => {
            switch (D({
                    ...G,
                    tools: f,
                    commands: v,
                    resources: N
                }), G.type) {
                case "connected": {
                    if (KK6()) WT7(G.client, G.name, _);
                    if (G.client.onclose = () => {
                            let V = G.config.type ?? "stdio";
                            if (VN(G.name, G.config).catch(() => {
                                    k(`Failed to invalidate the server cache: ${G.name}`)
                                }), iv(G.name)) {
                                n1(G.name, "Server is disabled, skipping automatic reconnection");
                                return
                            }
                            if (V !== "stdio" && V !== "sdk") {
                                let L = jiY(V);
                                n1(G.name, `${L} transport closed/disconnected, attempting automatic reconnection`);
                                let h = w.current.get(G.name);
                                if (h) clearTimeout(h), w.current.delete(G.name);
                                (async () => {
                                    for (let u = 1; u <= Bv6; u++) {
                                        if (iv(G.name)) {
                                            n1(G.name, "Server disabled during reconnection, stopping retry"), w.current.delete(G.name);
                                            return
                                        }
                                        D({
                                            ...G,
                                            type: "pending",
                                            reconnectAttempt: u,
                                            maxReconnectAttempts: Bv6
                                        });
                                        let I = Date.now();
                                        try {
                                            let B = await nl(G.name, G.config),
                                                b = Date.now() - I;
                                            if (B.client.type === "connected") {
                                                n1(G.name, `${L} reconnection successful after ${b}ms (attempt ${u})`), w.current.delete(G.name), X(B);
                                                return
                                            }
                                            if (n1(G.name, `${L} reconnection attempt ${u} completed with status: ${B.client.type}`), u === Bv6) {
                                                n1(G.name, `Max reconnection attempts (${Bv6}) reached, giving up`), w.current.delete(G.name), X(B);
                                                return
                                            }
                                        } catch (B) {
                                            let b = Date.now() - I;
                                            if (EY(G.name, `${L} reconnection attempt ${u} failed after ${b}ms: ${B}`), u === Bv6) {
                                                n1(G.name, `Max reconnection attempts (${Bv6}) reached, giving up`), w.current.delete(G.name), D({
                                                    ...G,
                                                    type: "failed"
                                                });
                                                return
                                            }
                                        }
                                        let g = Math.min($iY * Math.pow(2, u - 1), HiY);
                                        n1(G.name, `Scheduling reconnection attempt ${u+1} in ${g}ms`), await new Promise((B) => {
                                            let b = setTimeout(B, g);
                                            w.current.set(G.name, b)
                                        })
                                    }
                                })()
                            } else D({
                                ...G,
                                type: "failed"
                            })
                        }, !1) switch (V.action) {
                        case "register":
                        case "skip":
                    }
                    if (G.capabilities?.tools?.listChanged) G.client.setNotificationHandler(Hy6, async () => {
                        n1(G.name, "Received tools/list_changed notification, refreshing tools");
                        try {
                            let V = JE.cache.get(G.name);
                            JE.cache.delete(G.name);
                            let L = await JE(G),
                                h = L.length;
                            if (V) V.then((R) => {
                                d("tengu_mcp_list_changed", {
                                    type: "tools",
                                    previousCount: R.length,
                                    newCount: h
                                })
                            }, () => {
                                d("tengu_mcp_list_changed", {
                                    type: "tools",
                                    newCount: h
                                })
                            });
                            else d("tengu_mcp_list_changed", {
                                type: "tools",
                                newCount: h
                            });
                            D({
                                ...G,
                                tools: L
                            })
                        } catch (V) {
                            EY(G.name, `Failed to refresh tools after list_changed notification: ${_1(V)}`)
                        }
                    });
                    if (G.capabilities?.prompts?.listChanged) G.client.setNotificationHandler(wy6, async () => {
                        n1(G.name, "Received prompts/list_changed notification, refreshing prompts"), d("tengu_mcp_list_changed", {
                            type: "prompts"
                        });
                        try {
                            K_6.cache.delete(G.name);
                            let V = await K_6(G);
                            D({
                                ...G,
                                commands: V
                            })
                        } catch (V) {
                            EY(G.name, `Failed to refresh prompts after list_changed notification: ${_1(V)}`)
                        }
                    });
                    if (G.capabilities?.resources?.listChanged) G.client.setNotificationHandler(zy6, async () => {
                        n1(G.name, "Received resources/list_changed notification, refreshing resources"), d("tengu_mcp_list_changed", {
                            type: "resources"
                        });
                        try {
                            Rl.cache.delete(G.name);
                            let V = await Rl(G);
                            D({
                                ...G,
                                resources: V
                            })
                        } catch (V) {
                            EY(G.name, `Failed to refresh resources after list_changed notification: ${_1(V)}`)
                        }
                    });
                    break
                }
                case "needs-auth":
                case "failed":
                case "pending":
                case "disabled":
                    break
            }
        }, [D]),
        P = R1();
    Ff.useEffect(() => {
        async function G() {
            let {
                servers: f,
                errors: v
            } = q ? {
                servers: {},
                errors: []
            } : await jZ6(), N = {
                ...f,
                ...A
            };
            wwq(_, v), _((V) => {
                let {
                    stale: L,
                    ...h
                } = Aw4(V.mcp, N);
                for (let I of L) {
                    let g = w.current.get(I.name);
                    if (g) clearTimeout(g), w.current.delete(I.name);
                    if (I.type === "connected") I.client.onclose = void 0, VN(I.name, I.config).catch(() => {})
                }
                let R = new Set(h.clients.map((I) => I.name)),
                    u = Object.entries(N).filter(([I]) => !R.has(I)).map(([I, g]) => ({
                        name: I,
                        type: iv(I) ? "disabled" : "pending",
                        config: g
                    }));
                if (u.length === 0 && L.length === 0) return V;
                return {
                    ...V,
                    mcp: {
                        ...V.mcp,
                        ...h,
                        clients: [...h.clients, ...u]
                    }
                }
            })
        }
        G().catch((f) => {
            EY("useManageMCPConnections", `Failed to initialize servers as pending: ${_1(f)}`)
        })
    }, [q, A, _, P, z]), Ff.useEffect(() => {
        let G = !1;
        async function f() {
            Xw4();
            let {
                servers: v,
                errors: N
            } = q ? {
                servers: {},
                errors: []
            } : await jZ6();
            if (G) return;
            wwq(_, N);
            let V = {
                    ...v,
                    ...A
                },
                L = Object.fromEntries(Object.entries(V).filter(([g]) => !iv(g)));
            ZL1(X, L).catch((g) => {
                EY("useManageMcpConnections", `Failed to get MCP resources: ${_1(g)}`)
            });
            let h = {};
            if (!q) {
                if (h = await Z96(), G) return;
                if (Object.keys(h).length > 0) {
                    _((B) => {
                        let b = new Set(B.mcp.clients.map((Q) => Q.name)),
                            p = Object.entries(h).filter(([Q]) => !b.has(Q)).map(([Q, U]) => ({
                                name: Q,
                                type: iv(Q) ? "disabled" : "pending",
                                config: U
                            }));
                        if (p.length === 0) return B;
                        return {
                            ...B,
                            mcp: {
                                ...B.mcp,
                                clients: [...B.mcp.clients, ...p]
                            }
                        }
                    });
                    let g = Object.fromEntries(Object.entries(h).filter(([B]) => !iv(B)));
                    ZL1(X, g).catch((B) => {
                        EY("useManageMcpConnections", `Failed to get claude.ai MCP resources: ${_1(B)}`)
                    })
                }
            }
            let R = {
                    ...V,
                    ...h
                },
                u = {
                    enterprise: 0,
                    global: 0,
                    project: 0,
                    user: 0,
                    plugin: 0,
                    claudeai: 0
                },
                I = [];
            for (let [g, B] of Object.entries(R))
                if (B.scope === "enterprise") u.enterprise++;
                else if (B.scope === "user") u.global++;
            else if (B.scope === "project") u.project++;
            else if (B.scope === "local") u.user++;
            else if (B.scope === "dynamic") u.plugin++;
            else if (B.scope === "claudeai") u.claudeai++;
            d("tengu_mcp_servers", {
                ...u,
                ...{}
            })
        }
        return f(), () => {
            G = !0
        }
    }, [q, A, X, _, Y, P, z]), Ff.useEffect(() => {
        let G = w.current;
        return () => {
            for (let f of G.values()) clearTimeout(f);
            if (G.clear(), J.current !== null) clearTimeout(J.current), J.current = null, M()
        }
    }, [M]);
    let W = Ff.useCallback(async (G) => {
            let f = K.getState().mcp.clients.find((V) => V.name === G);
            if (!f) throw Error(`MCP server ${G} not found`);
            let v = w.current.get(G);
            if (v) clearTimeout(v), w.current.delete(G);
            let N = await nl(G, f.config);
            return X(N), N
        }, [K, X]),
        Z = Ff.useCallback(async (G) => {
            let f = K.getState().mcp.clients.find((N) => N.name === G);
            if (!f) throw Error(`MCP server ${G} not found`);
            if (f.type !== "disabled") {
                let N = w.current.get(G);
                if (N) clearTimeout(N), w.current.delete(G);
                if (MZ6(G, !1), f.type === "connected") await VN(G, f.config);
                D({
                    name: G,
                    type: "disabled",
                    config: f.config
                })
            } else {
                MZ6(G, !0), D({
                    name: G,
                    type: "pending",
                    config: f.config
                });
                let N = await nl(G, f.config);
                X(N)
            }
        }, [K, D, X]);
    return {
        reconnectMcpServer: W,
        toggleMcpServer: Z
    }
}
// @from(Ln 397861, Col 0)
function jiY(A) {
    switch (A) {
        case "http":
            return "HTTP";
        case "ws":
        case "ws-ide":
            return "WebSocket";
        default:
            return "SSE"
    }
}
// @from(Ln 397872, Col 4)
Ff
// @from(Ln 397872, Col 8)
Bv6 = 5
// @from(Ln 397873, Col 4)
$iY = 1000
// @from(Ln 397874, Col 4)
HiY = 30000
// @from(Ln 397875, Col 4)
$wq = E(() => {
    T1();
    QP();
    k1();
    hD();
    NA();
    dU8();
    lU8();
    WZ();
    $Z6();
    sy();
    qM();
    H1();
    V1();
    kw1();
    Vw1();
    s8();
    wz();
    Ff = t(P6(), 1)
})
// @from(Ln 397896, Col 0)
function gv6() {
    let A = Y_6.useContext(iU8);
    if (!A) throw Error("useMcpReconnect must be used within MCPConnectionManager");
    return A.reconnectMcpServer
}
// @from(Ln 397902, Col 0)
function G16() {
    let A = Y_6.useContext(iU8);
    if (!A) throw Error("useMcpToggleEnabled must be used within MCPConnectionManager");
    return A.toggleMcpServer
}
// @from(Ln 397908, Col 0)
function GL1(A) {
    let q = A6(6),
        {
            children: K,
            dynamicMcpConfig: Y,
            isStrictMcpConfig: z
        } = A,
        {
            reconnectMcpServer: _,
            toggleMcpServer: w
        } = Owq(Y, z),
        O;
    if (q[0] !== _ || q[1] !== w) O = {
        reconnectMcpServer: _,
        toggleMcpServer: w
    }, q[0] = _, q[1] = w, q[2] = O;
    else O = q[2];
    let $ = O,
        H;
    if (q[3] !== K || q[4] !== $) H = Y_6.default.createElement(iU8.Provider, {
        value: $
    }, K), q[3] = K, q[4] = $, q[5] = H;
    else H = q[5];
    return H
}
// @from(Ln 397933, Col 4)
Y_6
// @from(Ln 397933, Col 9)
iU8
// @from(Ln 397934, Col 4)
f16 = E(() => {
    e6();
    $wq();
    Y_6 = t(P6(), 1), iU8 = Y_6.createContext(null)
})
// @from(Ln 397940, Col 0)
function fL1(A, q) {
    switch (A.client.type) {
        case "connected":
            return {
                message: `Reconnected to ${q}.`, success: !0
            };
        case "needs-auth":
            return {
                message: `${q} requires authentication. Use the 'Authenticate' option.`, success: !1
            };
        case "failed":
            return {
                message: `Failed to reconnect to ${q}.`, success: !1
            };
        default:
            return {
                message: `Unknown result when reconnecting to ${q}.`, success: !1
            }
    }
}
// @from(Ln 397961, Col 0)
function kn6(A, q) {
    let K = A instanceof Error ? A.message : String(A);
    return `Error reconnecting to ${q}: ${K}`
}
// @from(Ln 397966, Col 0)
function En6({
    server: A,
    serverToolsCount: q,
    onViewTools: K,
    onCancel: Y,
    onComplete: z,
    borderless: _ = !1
}) {
    let [w] = z7(), O = IK(), $ = M1((Z) => Z.mcp), H = gv6(), j = G16(), [J, M] = lK.useState(!1), D = lK.default.useCallback(async () => {
        let Z = A.client.type !== "disabled";
        try {
            await j(A.name), Y()
        } catch (G) {
            z(`Failed to ${Z?"disable":"enable"} MCP server '${A.name}': ${_1(G)}`)
        }
    }, [A.client.type, A.name, j, Y, z]), X = String(A.name).charAt(0).toUpperCase() + String(A.name).slice(1), P = PW1($.commands, A.name).length, W = [];
    if (A.client.type !== "disabled" && q > 0) W.push({
        label: "View tools",
        value: "tools"
    });
    if (A.client.type !== "disabled") W.push({
        label: "Reconnect",
        value: "reconnectMcpServer"
    });
    if (W.push({
            label: A.client.type !== "disabled" ? "Disable" : "Enable",
            value: "toggle-enabled"
        }), W.length === 0) W.push({
        label: "Back",
        value: "back"
    });
    if (J) return lK.default.createElement(m, {
        flexDirection: "column",
        gap: 1,
        padding: 1
    }, lK.default.createElement(T, {
        color: "text"
    }, "Reconnecting to ", lK.default.createElement(T, {
        bold: !0
    }, A.name)), lK.default.createElement(m, null, lK.default.createElement(Wq, null), lK.default.createElement(T, null, " Restarting MCP server process")), lK.default.createElement(T, {
        dimColor: !0
    }, "This may take a few moments."));
    return lK.default.createElement(m, {
        flexDirection: "column"
    }, lK.default.createElement(m, {
        flexDirection: "column",
        paddingX: 1,
        borderStyle: _ ? void 0 : "round"
    }, lK.default.createElement(m, {
        marginBottom: 1
    }, lK.default.createElement(T, {
        bold: !0
    }, X, " MCP Server")), lK.default.createElement(m, {
        flexDirection: "column",
        gap: 0
    }, lK.default.createElement(m, null, lK.default.createElement(T, {
        bold: !0
    }, "Status: "), A.client.type === "disabled" ? lK.default.createElement(T, null, kA("inactive", w)(a6.radioOff), " disabled") : A.client.type === "connected" ? lK.default.createElement(T, null, kA("success", w)(a6.tick), " connected") : A.client.type === "pending" ? lK.default.createElement(lK.default.Fragment, null, lK.default.createElement(T, {
        dimColor: !0
    }, a6.radioOff), lK.default.createElement(T, null, " connecting…")) : lK.default.createElement(T, null, kA("error", w)(a6.cross), " failed")), lK.default.createElement(m, null, lK.default.createElement(T, {
        bold: !0
    }, "Command: "), lK.default.createElement(T, {
        dimColor: !0
    }, A.config.command)), A.config.args && A.config.args.length > 0 && lK.default.createElement(m, null, lK.default.createElement(T, {
        bold: !0
    }, "Args: "), lK.default.createElement(T, {
        dimColor: !0
    }, A.config.args.join(" "))), lK.default.createElement(m, null, lK.default.createElement(T, {
        bold: !0
    }, "Config location: "), lK.default.createElement(T, {
        dimColor: !0
    }, PZ(cv(A.name)?.scope ?? "dynamic"))), A.client.type === "connected" && lK.default.createElement(PL1, {
        serverToolsCount: q,
        serverPromptsCount: P,
        serverResourcesCount: $.resources[A.name]?.length || 0
    }), A.client.type === "connected" && q > 0 && lK.default.createElement(m, null, lK.default.createElement(T, {
        bold: !0
    }, "Tools: "), lK.default.createElement(T, {
        dimColor: !0
    }, q, " tools"))), W.length > 0 && lK.default.createElement(m, {
        marginTop: 1
    }, lK.default.createElement(T8, {
        options: W,
        onChange: async (Z) => {
            if (Z === "tools") K();
            else if (Z === "reconnectMcpServer") {
                M(!0);
                try {
                    let G = await H(A.name),
                        {
                            message: f
                        } = fL1(G, A.name);
                    z?.(f)
                } catch (G) {
                    z?.(kn6(G, A.name))
                } finally {
                    M(!1)
                }
            } else if (Z === "toggle-enabled") await D();
            else if (Z === "back") Y()
        },
        onCancel: Y
    }))), lK.default.createElement(m, {
        marginTop: 1
    }, lK.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, O.pending ? lK.default.createElement(lK.default.Fragment, null, "Press ", O.keyName, " again to exit") : lK.default.createElement(C8, null, lK.default.createElement(a1, {
        shortcut: "↑↓",
        action: "navigate"
    }), lK.default.createElement(a1, {
        shortcut: "Enter",
        action: "select"
    }), lK.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    })))))
}
// @from(Ln 398086, Col 4)
lK
// @from(Ln 398087, Col 4)
TL1 = E(() => {
    i6();
    o9();
    PO();
    Xq();
    Lq();
    OK();
    b7();
    NA();
    qM();
    WZ();
    UU8();
    f16();
    LO();
    s8();
    lK = t(P6(), 1)
})
// @from(Ln 398105, Col 0)
function z_6({
    server: A,
    serverToolsCount: q,
    onViewTools: K,
    onCancel: Y,
    onComplete: z,
    borderless: _ = !1
}) {
    let [w] = z7(), O = IK(), {
        columns: $
    } = KA(), [H, j] = F8.default.useState(!1), [J, M] = F8.default.useState(null), D = M1((w6) => w6.mcp), X = xA(), [P, W] = F8.default.useState(null), [Z, G] = F8.useState(!1), f = F8.useRef(null), [v, N] = F8.useState(!1), [V, L] = F8.useState(null), [h, R] = F8.useState(!1), [u, I] = F8.useState(null), [g, B] = F8.useState(!1), [b, p] = F8.useState(!1), [Q, U] = F8.useState(""), [r, e] = F8.useState(0), [Y6, H6] = F8.useState(null);
    F8.useEffect(() => () => f.current?.abort(), []);
    let J6 = A.isAuthenticated || A.client.type === "connected" && q > 0,
        K6 = gv6(),
        s = F8.default.useCallback(async () => {
            N(!1), L(null), G(!0);
            try {
                let w6 = await K6(A.name),
                    O6 = w6.client.type === "connected";
                if (d("tengu_claudeai_mcp_auth_completed", {
                        success: O6
                    }), O6) z?.(`Authentication successful. Connected to ${A.name}.`);
                else if (w6.client.type === "needs-auth") z?.("Authentication successful, but server still requires authentication. You may need to manually restart Claude Code.");
                else z?.("Authentication successful, but server reconnection failed. You may need to manually restart Claude Code for the changes to take effect.")
            } catch (w6) {
                d("tengu_claudeai_mcp_auth_completed", {
                    success: !1
                }), z?.(kn6(w6, A.name))
            } finally {
                G(!1)
            }
        }, [K6, A.name, z]),
        X6 = F8.default.useCallback(async () => {
            await VN(A.name, {
                ...A.config,
                scope: A.scope
            }), X((w6) => {
                let O6 = w6.mcp.clients.map((R6) => R6.name === A.name ? {
                        ...R6,
                        type: "needs-auth"
                    } : R6),
                    L6 = WW1(w6.mcp.tools, A.name),
                    y6 = ZW1(w6.mcp.commands, A.name),
                    G6 = GW1(w6.mcp.resources, A.name);
                return {
                    ...w6,
                    mcp: {
                        ...w6.mcp,
                        clients: O6,
                        tools: L6,
                        commands: y6,
                        resources: G6
                    }
                }
            }), d("tengu_claudeai_mcp_clear_auth_completed", {}), z?.(`Disconnected from ${A.name}.`), R(!1), I(null), B(!1)
        }, [A.name, A.config, A.scope, X, z]);
    D8("confirm:no", () => {
        f.current?.abort(), f.current = null, j(!1), W(null)
    }, {
        context: "Confirmation",
        isActive: H
    }), D8("confirm:no", () => {
        N(!1), L(null)
    }, {
        context: "Confirmation",
        isActive: v
    }), D8("confirm:no", () => {
        R(!1), I(null), B(!1)
    }, {
        context: "Confirmation",
        isActive: h
    }), jA((w6, O6) => {
        if (O6.return && v) s();
        if (O6.return && h)
            if (g) X6();
            else {
                let L6 = P7(),
                    G6 = `${new URL(L6.CLAUDE_AI_AUTHORIZE_URL).origin}/settings/connectors`;
                I(G6), B(!0), R9(G6)
            } if (w6 === "c" && !b) {
            let L6 = P || V || u;
            if (L6) ZZ(L6).then((y6) => {
                if (y6) p(!0), setTimeout(p, 2000, !1)
            })
        }
    });
    let z6 = String(A.name).charAt(0).toUpperCase() + String(A.name).slice(1),
        N6 = PW1(D.commands, A.name).length,
        $6 = G16(),
        n = F8.default.useCallback(async () => {
            let w6 = P7(),
                O6 = new URL(w6.CLAUDE_AI_AUTHORIZE_URL).origin,
                y6 = L3()?.organizationUuid,
                G6;
            if (y6 && A.config.type === "claudeai-proxy" && A.config.id) {
                let R6 = A.config.id.startsWith("mcprs") ? "mcpsrv" + A.config.id.slice(5) : A.config.id;
                G6 = `${O6}/api/organizations/${y6}/mcp/start-auth/${R6}`
            } else G6 = `${O6}/settings/connectors`;
            L(G6), N(!0), d("tengu_claudeai_mcp_auth_started", {}), await R9(G6)
        }, [A.config]),
        o = F8.default.useCallback(() => {
            R(!0), d("tengu_claudeai_mcp_clear_auth_started", {})
        }, []),
        a = F8.default.useCallback(async () => {
            let w6 = A.client.type !== "disabled";
            try {
                if (await $6(A.name), A.config.type === "claudeai-proxy") d("tengu_claudeai_mcp_toggle", {
                    new_state: w6 ? "disabled" : "enabled"
                });
                Y()
            } catch (O6) {
                z?.(`Failed to ${w6?"disable":"enable"} MCP server '${A.name}': ${_1(O6)}`)
            }
        }, [A.client.type, A.config.type, A.name, $6, Y, z]),
        i = F8.default.useCallback(async () => {
            if (A.config.type === "claudeai-proxy") return;
            j(!0), M(null);
            let w6 = new AbortController;
            f.current = w6;
            try {
                if (A.isAuthenticated && A.config) await Tn6(A.name, A.config, {
                    preserveStepUpState: !0
                });
                if (A.config) {
                    await mv6(A.name, A.config, W, w6.signal, {
                        onWaitingForCallback: (L6) => {
                            H6(() => L6)
                        }
                    }), d("tengu_mcp_auth_config_authenticate", {
                        wasAuthenticated: A.isAuthenticated
                    });
                    let O6 = await K6(A.name);
                    if (O6.client.type === "connected") {
                        let L6 = J6 ? `Authentication successful. Reconnected to ${A.name}.` : `Authentication successful. Connected to ${A.name}.`;
                        z?.(L6)
                    } else if (O6.client.type === "needs-auth") z?.("Authentication successful, but server still requires authentication. You may need to manually restart Claude Code.");
                    else n1(A.name, "Reconnection failed after authentication"), z?.("Authentication successful, but server reconnection failed. You may need to manually restart Claude Code for the changes to take effect.")
                }
            } catch (O6) {
                if (O6 instanceof Error && !(O6 instanceof uv6)) M(O6.message)
            } finally {
                j(!1), f.current = null, H6(null), U("")
            }
        }, [A.isAuthenticated, A.config, A.name, z, K6, J6]),
        l = async () => {
            if (A.config.type === "claudeai-proxy") return;
            if (A.config) await Tn6(A.name, A.config), d("tengu_mcp_auth_config_clear", {}), await VN(A.name, {
                ...A.config,
                scope: A.scope
            }), X((w6) => {
                let O6 = w6.mcp.clients.map((R6) => R6.name === A.name ? {
                        ...R6,
                        type: "failed"
                    } : R6),
                    L6 = WW1(w6.mcp.tools, A.name),
                    y6 = ZW1(w6.mcp.commands, A.name),
                    G6 = GW1(w6.mcp.resources, A.name);
                return {
                    ...w6,
                    mcp: {
                        ...w6.mcp,
                        clients: O6,
                        tools: L6,
                        commands: y6,
                        resources: G6
                    }
                }
            }), z?.(`Authentication cleared for ${A.name}.`)
        };
    if (H) return F8.default.createElement(m, {
        flexDirection: "column",
        gap: 1,
        padding: 1
    }, F8.default.createElement(T, {
        color: "claude"
    }, "Authenticating with ", A.name, "…"), F8.default.createElement(m, null, F8.default.createElement(Wq, null), F8.default.createElement(T, null, " A browser window will open for authentication")), P && F8.default.createElement(m, {
        flexDirection: "column"
    }, F8.default.createElement(m, null, F8.default.createElement(T, {
        dimColor: !0
    }, "If your browser doesn't open automatically, copy this URL manually", " "), b ? F8.default.createElement(T, {
        color: "success"
    }, "(Copied!)") : F8.default.createElement(T, {
        dimColor: !0
    }, F8.default.createElement(a1, {
        shortcut: "c",
        action: "copy",
        parens: !0
    }))), F8.default.createElement(y7, {
        url: P
    })), H && P && Y6 && F8.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, F8.default.createElement(T, {
        dimColor: !0
    }, "If the redirect page shows a connection error, paste the URL from your browser's address bar:"), F8.default.createElement(m, null, F8.default.createElement(T, {
        dimColor: !0
    }, "URL ", ">", " "), F8.default.createElement(J5, {
        value: Q,
        onChange: U,
        onSubmit: (w6) => {
            Y6(w6.trim()), U("")
        },
        cursorOffset: r,
        onChangeCursorOffset: e,
        columns: $ - 8
    }))), F8.default.createElement(m, {
        marginLeft: 3
    }, F8.default.createElement(T, {
        dimColor: !0
    }, "Return here after authenticating in your browser. Press Esc to go back.")));
    if (v) return F8.default.createElement(m, {
        flexDirection: "column",
        gap: 1,
        padding: 1
    }, F8.default.createElement(T, {
        color: "claude"
    }, "Authenticating with ", A.name, "…"), F8.default.createElement(m, null, F8.default.createElement(Wq, null), F8.default.createElement(T, null, " A browser window will open for authentication")), V && F8.default.createElement(m, {
        flexDirection: "column"
    }, F8.default.createElement(m, null, F8.default.createElement(T, {
        dimColor: !0
    }, "If your browser doesn't open automatically, copy this URL manually", " "), b ? F8.default.createElement(T, {
        color: "success"
    }, "(Copied!)") : F8.default.createElement(T, {
        dimColor: !0
    }, F8.default.createElement(a1, {
        shortcut: "c",
        action: "copy",
        parens: !0
    }))), F8.default.createElement(y7, {
        url: V
    })), F8.default.createElement(m, {
        marginLeft: 3,
        flexDirection: "column"
    }, F8.default.createElement(T, {
        color: "permission"
    }, "Press ", F8.default.createElement(T, {
        bold: !0
    }, "Enter"), " after authenticating in your browser."), F8.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, F8.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    }))));
    if (h) return F8.default.createElement(m, {
        flexDirection: "column",
        gap: 1,
        padding: 1
    }, F8.default.createElement(T, {
        color: "claude"
    }, "Clear authentication for ", A.name), g ? F8.default.createElement(F8.default.Fragment, null, F8.default.createElement(T, null, 'Find the MCP server in the browser and click "Disconnect".'), u && F8.default.createElement(m, {
        flexDirection: "column"
    }, F8.default.createElement(m, null, F8.default.createElement(T, {
        dimColor: !0
    }, "If your browser didn't open automatically, copy this URL manually", " "), b ? F8.default.createElement(T, {
        color: "success"
    }, "(Copied!)") : F8.default.createElement(T, {
        dimColor: !0
    }, F8.default.createElement(a1, {
        shortcut: "c",
        action: "copy",
        parens: !0
    }))), F8.default.createElement(y7, {
        url: u
    })), F8.default.createElement(m, {
        marginLeft: 3,
        flexDirection: "column"
    }, F8.default.createElement(T, {
        color: "permission"
    }, "Press ", F8.default.createElement(T, {
        bold: !0
    }, "Enter"), " when done."), F8.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, F8.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    })))) : F8.default.createElement(F8.default.Fragment, null, F8.default.createElement(T, null, 'This will open claude.ai in the browser. Find the MCP server in the list and click "Disconnect".'), F8.default.createElement(m, {
        marginLeft: 3,
        flexDirection: "column"
    }, F8.default.createElement(T, {
        color: "permission"
    }, "Press ", F8.default.createElement(T, {
        bold: !0
    }, "Enter"), " to open the browser."), F8.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, F8.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    })))));
    if (Z) return F8.default.createElement(m, {
        flexDirection: "column",
        gap: 1,
        padding: 1
    }, F8.default.createElement(T, {
        color: "text"
    }, "Connecting to ", F8.default.createElement(T, {
        bold: !0
    }, A.name), "…"), F8.default.createElement(m, null, F8.default.createElement(Wq, null), F8.default.createElement(T, null, " Establishing connection to MCP server")), F8.default.createElement(T, {
        dimColor: !0
    }, "This may take a few moments."));
    let q6 = [];
    if (A.client.type === "disabled") q6.push({
        label: "Enable",
        value: "toggle-enabled"
    });
    if (A.client.type === "connected" && q > 0) q6.push({
        label: "View tools",
        value: "tools"
    });
    if (A.config.type === "claudeai-proxy") {
        if (A.client.type === "connected") q6.push({
            label: "Clear authentication",
            value: "claudeai-clear-auth"
        });
        else if (A.client.type !== "disabled") q6.push({
            label: "Authenticate",
            value: "claudeai-auth"
        })
    } else {
        if (J6) q6.push({
            label: "Re-authenticate",
            value: "reauth"
        }), q6.push({
            label: "Clear authentication",
            value: "clear-auth"
        });
        if (!J6) q6.push({
            label: "Authenticate",
            value: "auth"
        })
    }
    if (A.client.type !== "disabled") {
        if (A.client.type !== "needs-auth") q6.push({
            label: "Reconnect",
            value: "reconnectMcpServer"
        });
        q6.push({
            label: "Disable",
            value: "toggle-enabled"
        })
    }
    if (q6.length === 0) q6.push({
        label: "Back",
        value: "back"
    });
    return F8.default.createElement(m, {
        flexDirection: "column"
    }, F8.default.createElement(m, {
        flexDirection: "column",
        paddingX: 1,
        borderStyle: _ ? void 0 : "round"
    }, F8.default.createElement(m, {
        marginBottom: 1
    }, F8.default.createElement(T, {
        bold: !0
    }, z6, " MCP Server")), F8.default.createElement(m, {
        flexDirection: "column",
        gap: 0
    }, F8.default.createElement(m, null, F8.default.createElement(T, {
        bold: !0
    }, "Status: "), A.client.type === "disabled" ? F8.default.createElement(T, null, kA("inactive", w)(a6.radioOff), " disabled") : A.client.type === "connected" ? F8.default.createElement(T, null, kA("success", w)(a6.tick), " connected") : A.client.type === "pending" ? F8.default.createElement(F8.default.Fragment, null, F8.default.createElement(T, {
        dimColor: !0
    }, a6.radioOff), F8.default.createElement(T, null, " connecting…")) : A.client.type === "needs-auth" ? F8.default.createElement(T, null, kA("warning", w)(a6.triangleUpOutline), " needs authentication") : F8.default.createElement(T, null, kA("error", w)(a6.cross), " failed")), A.transport !== "claudeai-proxy" && F8.default.createElement(m, null, F8.default.createElement(T, {
        bold: !0
    }, "Auth: "), J6 ? F8.default.createElement(T, null, kA("success", w)(a6.tick), " authenticated") : F8.default.createElement(T, null, kA("error", w)(a6.cross), " not authenticated")), F8.default.createElement(m, null, F8.default.createElement(T, {
        bold: !0
    }, "URL: "), F8.default.createElement(T, {
        dimColor: !0
    }, A.config.url)), F8.default.createElement(m, null, F8.default.createElement(T, {
        bold: !0
    }, "Config location: "), F8.default.createElement(T, {
        dimColor: !0
    }, PZ(A.scope))), A.client.type === "connected" && F8.default.createElement(PL1, {
        serverToolsCount: q,
        serverPromptsCount: N6,
        serverResourcesCount: D.resources[A.name]?.length || 0
    }), A.client.type === "connected" && q > 0 && F8.default.createElement(m, null, F8.default.createElement(T, {
        bold: !0
    }, "Tools: "), F8.default.createElement(T, {
        dimColor: !0
    }, q, " tools"))), J && F8.default.createElement(m, {
        marginTop: 1
    }, F8.default.createElement(T, {
        color: "error"
    }, "Error: ", J)), q6.length > 0 && F8.default.createElement(m, {
        marginTop: 1
    }, F8.default.createElement(T8, {
        options: q6,
        onChange: async (w6) => {
            switch (w6) {
                case "tools":
                    K();
                    break;
                case "auth":
                case "reauth":
                    await i();
                    break;
                case "clear-auth":
                    await l();
                    break;
                case "claudeai-auth":
                    await n();
                    break;
                case "claudeai-clear-auth":
                    o();
                    break;
                case "reconnectMcpServer":
                    G(!0);
                    try {
                        let O6 = await K6(A.name);
                        if (A.config.type === "claudeai-proxy") d("tengu_claudeai_mcp_reconnect", {
                            success: O6.client.type === "connected"
                        });
                        let {
                            message: L6
                        } = fL1(O6, A.name);
                        z?.(L6)
                    } catch (O6) {
                        if (A.config.type === "claudeai-proxy") d("tengu_claudeai_mcp_reconnect", {
                            success: !1
                        });
                        z?.(kn6(O6, A.name))
                    } finally {
                        G(!1)
                    }
                    break;
                case "toggle-enabled":
                    await a();
                    break;
                case "back":
                    Y();
                    break
            }
        },
        onCancel: Y
    }))), F8.default.createElement(m, {
        marginTop: 1
    }, F8.default.createElement(T, {
        dimColor: !0,
        italic: !0
    }, O.pending ? F8.default.createElement(F8.default.Fragment, null, "Press ", O.keyName, " again to exit") : F8.default.createElement(C8, null, F8.default.createElement(a1, {
        shortcut: "↑↓",
        action: "navigate"
    }), F8.default.createElement(a1, {
        shortcut: "Enter",
        action: "select"
    }), F8.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    })))))
}
// @from(Ln 398566, Col 4)
F8
// @from(Ln 398567, Col 4)
vL1 = E(() => {
    i6();
    AH();
    _7();
    o9();
    V1();
    PO();
    Xq();
    Lq();
    OK();
    b7();
    W16();
    LO();
    QP();
    NA();
    k1();
    qM();
    UU8();
    i6();
    vc();
    f16();
    _q();
    kX();
    F5();
    fA();
    s8();
    F8 = t(P6(), 1)
})
// @from(Ln 398596, Col 0)
function yn6(A) {
    let q = A6(19),
        {
            server: K,
            onSelectTool: Y,
            onBack: z
        } = A,
        _ = M1(MiY),
        w;
    A: {
        if (K.client.type !== "connected") {
            let P;
            if (q[0] === Symbol.for("react.memo_cache_sentinel")) P = [], q[0] = P;
            else P = q[0];
            w = P;
            break A
        }
        let X;
        if (q[1] !== _ || q[2] !== K.name) X = eB(_, K.name),
        q[1] = _,
        q[2] = K.name,
        q[3] = X;
        else X = q[3];w = X
    }
    let O = w,
        $;
    if (q[4] !== K.name || q[5] !== O) {
        let X;
        if (q[7] !== K.name) X = (P, W) => {
            let Z = h31(P.name, K.name),
                G = P.userFacingName ? P.userFacingName({}) : Z,
                f = S31(G),
                v = P.isReadOnly?.({}) ?? !1,
                N = P.isDestructive?.({}) ?? !1,
                V = P.isOpenWorld?.({}) ?? !1,
                L = [];
            if (v) L.push("read-only");
            if (N) L.push("destructive");
            if (V) L.push("open-world");
            return {
                label: f,
                value: W.toString(),
                description: L.length > 0 ? L.join(", ") : void 0,
                descriptionColor: N ? "error" : v ? "success" : void 0
            }
        }, q[7] = K.name, q[8] = X;
        else X = q[8];
        $ = O.map(X), q[4] = K.name, q[5] = O, q[6] = $
    } else $ = q[6];
    let H = $,
        j = `Tools for ${K.name}`,
        J = `${O.length} tool${O.length===1?"":"s"}`,
        M;
    if (q[9] !== z || q[10] !== Y || q[11] !== O || q[12] !== H) M = O.length === 0 ? rl.default.createElement(T, {
        dimColor: !0
    }, "No tools available") : rl.default.createElement(T8, {
        options: H,
        onChange: (X) => {
            let P = parseInt(X),
                W = O[P];
            if (W) Y(W, P)
        },
        onCancel: z
    }), q[9] = z, q[10] = Y, q[11] = O, q[12] = H, q[13] = M;
    else M = q[13];
    let D;
    if (q[14] !== z || q[15] !== j || q[16] !== J || q[17] !== M) D = rl.default.createElement(m8, {
        title: j,
        subtitle: J,
        onCancel: z,
        inputGuide: JiY
    }, M), q[14] = z, q[15] = j, q[16] = J, q[17] = M, q[18] = D;
    else D = q[18];
    return D
}
// @from(Ln 398672, Col 0)
function JiY(A) {
    return A.pending ? rl.default.createElement(T, null, "Press ", A.keyName, " again to exit") : rl.default.createElement(C8, null, rl.default.createElement(a1, {
        shortcut: "↑↓",
        action: "navigate"
    }), rl.default.createElement(a1, {
        shortcut: "Enter",
        action: "select"
    }), rl.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
    }))
}
// @from(Ln 398687, Col 0)
function MiY(A) {
    return A.mcp.tools
}
// @from(Ln 398690, Col 4)
rl
// @from(Ln 398691, Col 4)
NL1 = E(() => {
    e6();
    i6();
    o9();
    qM();
    sy();
    NA();
    wq();
    Xq();
    Lq();
    OK();
    rl = t(P6(), 1)
})
// @from(Ln 398705, Col 0)
function Ln6(A) {
    let q = A6(44),
        {
            tool: K,
            server: Y,
            onBack: z
        } = A,
        [_, w] = V2.default.useState(""),
        O, $;
    if (q[0] !== Y.name || q[1] !== K) {
        $ = h31(K.name, Y.name);
        let p = K.userFacingName ? K.userFacingName({}) : $;
        O = S31(p), q[0] = Y.name, q[1] = K, q[2] = O, q[3] = $
    } else O = q[2], $ = q[3];
    let H = O,
        j;
    if (q[4] !== K) j = K.isReadOnly?.({}) ?? !1, q[4] = K, q[5] = j;
    else j = q[5];
    let J = j,
        M;
    if (q[6] !== K) M = K.isDestructive?.({}) ?? !1, q[6] = K, q[7] = M;
    else M = q[7];
    let D = M,
        X;
    if (q[8] !== K) X = K.isOpenWorld?.({}) ?? !1, q[8] = K, q[9] = X;
    else X = q[9];
    let P = X,
        W, Z;
    if (q[10] !== K) W = () => {
        (async function() {
            try {
                let U = await K.description({}, {
                    isNonInteractiveSession: !1,
                    toolPermissionContext: {
                        mode: "default",
                        additionalWorkingDirectories: new Map,
                        alwaysAllowRules: {},
                        alwaysDenyRules: {},
                        alwaysAskRules: {},
                        isBypassPermissionsModeAvailable: !1
                    },
                    tools: []
                });
                w(U)
            } catch {
                w("Failed to load description")
            }
        })()
    }, Z = [K], q[10] = K, q[11] = W, q[12] = Z;
    else W = q[11], Z = q[12];
    V2.default.useEffect(W, Z);
    let G;
    if (q[13] !== J) G = J && V2.default.createElement(T, {
        color: "success"
    }, " [read-only]"), q[13] = J, q[14] = G;
    else G = q[14];
    let f;
    if (q[15] !== D) f = D && V2.default.createElement(T, {
        color: "error"
    }, " [destructive]"), q[15] = D, q[16] = f;
    else f = q[16];
    let v;
    if (q[17] !== P) v = P && V2.default.createElement(T, {
        dimColor: !0
    }, " [open-world]"), q[17] = P, q[18] = v;
    else v = q[18];
    let N;
    if (q[19] !== H || q[20] !== G || q[21] !== f || q[22] !== v) N = V2.default.createElement(V2.default.Fragment, null, H, G, f, v), q[19] = H, q[20] = G, q[21] = f, q[22] = v, q[23] = N;
    else N = q[23];
    let V = N,
        L;
    if (q[24] === Symbol.for("react.memo_cache_sentinel")) L = V2.default.createElement(T, {
        bold: !0
    }, "Tool name: "), q[24] = L;
    else L = q[24];
    let h;
    if (q[25] !== $) h = V2.default.createElement(m, null, L, V2.default.createElement(T, {
        dimColor: !0
    }, $)), q[25] = $, q[26] = h;
    else h = q[26];
    let R;
    if (q[27] === Symbol.for("react.memo_cache_sentinel")) R = V2.default.createElement(T, {
        bold: !0
    }, "Full name: "), q[27] = R;
    else R = q[27];
    let u;
    if (q[28] !== K.name) u = V2.default.createElement(m, null, R, V2.default.createElement(T, {
        dimColor: !0
    }, K.name)), q[28] = K.name, q[29] = u;
    else u = q[29];
    let I;
    if (q[30] !== _) I = _ && V2.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, V2.default.createElement(T, {
        bold: !0
    }, "Description:"), V2.default.createElement(T, {
        wrap: "wrap"
    }, _)), q[30] = _, q[31] = I;
    else I = q[31];
    let g;
    if (q[32] !== K.inputJSONSchema) g = K.inputJSONSchema && K.inputJSONSchema.properties && Object.keys(K.inputJSONSchema.properties).length > 0 && V2.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, V2.default.createElement(T, {
        bold: !0
    }, "Parameters:"), V2.default.createElement(m, {
        marginLeft: 2,
        flexDirection: "column"
    }, Object.entries(K.inputJSONSchema.properties).map((p) => {
        let [Q, U] = p, e = K.inputJSONSchema?.required?.includes(Q);
        return V2.default.createElement(T, {
            key: Q
        }, "• ", Q, e && V2.default.createElement(T, {
            dimColor: !0
        }, " (required)"), ":", " ", V2.default.createElement(T, {
            dimColor: !0
        }, typeof U === "object" && U && "type" in U ? String(U.type) : "unknown"), typeof U === "object" && U && "description" in U && V2.default.createElement(T, {
            dimColor: !0
        }, " - ", String(U.description)))
    }))), q[32] = K.inputJSONSchema, q[33] = g;
    else g = q[33];
    let B;
    if (q[34] !== h || q[35] !== u || q[36] !== I || q[37] !== g) B = V2.default.createElement(m, {
        flexDirection: "column"
    }, h, u, I, g), q[34] = h, q[35] = u, q[36] = I, q[37] = g, q[38] = B;
    else B = q[38];
    let b;
    if (q[39] !== z || q[40] !== Y.name || q[41] !== B || q[42] !== V) b = V2.default.createElement(m8, {
        title: V,
        subtitle: Y.name,
        onCancel: z,
        inputGuide: DiY
    }, B), q[39] = z, q[40] = Y.name, q[41] = B, q[42] = V, q[43] = b;
    else b = q[43];
    return b
}
// @from(Ln 398843, Col 0)
function DiY(A) {
    return A.pending ? V2.default.createElement(T, null, "Press ", A.keyName, " again to exit") : V2.default.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })
}
// @from(Ln 398851, Col 4)
V2
// @from(Ln 398852, Col 4)
VL1 = E(() => {
    e6();
    i6();
    sy();
    wq();
    OK();
    V2 = t(P6(), 1)
})