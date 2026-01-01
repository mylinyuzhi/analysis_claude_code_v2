# OAuth Implementation Guide

## Table of Contents

1. [Local Callback Server Explained](#local-callback-server-explained)
2. [OAuth 2.0 + PKCE Flow Overview](#oauth-20--pkce-flow-overview)
3. [Implementation Steps](#implementation-steps)
4. [Complete Python Implementation](#complete-python-implementation)
5. [API Key vs OAuth Comparison](#api-key-vs-oauth-comparison)
6. [Important Considerations](#important-considerations)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

Key components in this document:
- `jQ0` (LocalCallbackServer) - HTTP callback server
- `KRA` (OAuthFlow) - OAuth flow orchestrator
- `RY2` (generateCodeVerifier) - PKCE verifier generation
- `TY2` (generateCodeChallenge) - PKCE challenge generation

---

## Local Callback Server Explained

### What is the Local Server?

The **Local Callback Server** (`jQ0` / LocalCallbackServer) is a temporary HTTP server that listens on `localhost` at a random port. Its purpose is to receive the OAuth callback from the browser after user authentication.

### Why is it Needed?

```
┌─────────────────────────────────────────────────────────────────┐
│                    The Problem                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CLI Program                         Browser                     │
│  ┌─────────┐                        ┌─────────┐                  │
│  │         │   How to communicate?  │         │                  │
│  │  Claude │  <-----------------?   │  User   │                  │
│  │  Code   │                        │  Login  │                  │
│  │         │                        │         │                  │
│  └─────────┘                        └─────────┘                  │
│                                                                  │
│  OAuth requires redirect_uri to return authorization code        │
│  Browser cannot directly communicate with CLI process            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    The Solution                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CLI Program              Local Server              Browser      │
│  ┌─────────┐             ┌──────────┐             ┌─────────┐   │
│  │         │   starts    │  HTTP    │   redirect  │         │   │
│  │  Claude │ ──────────> │  Server  │ <────────── │  User   │   │
│  │  Code   │             │ :54321   │             │  Login  │   │
│  │         │ <────────── │          │             │         │   │
│  └─────────┘  auth code  └──────────┘             └─────────┘   │
│                                                                  │
│  Local server acts as a "bridge" to receive browser redirect     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### How it Works

```
┌─────────────────────────────────────────────────────────────────┐
│                Local Server Workflow                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Claude Code starts local HTTP server                         │
│     http://localhost:54321/callback                              │
│                                                                  │
│  2. Opens browser → claude.ai/oauth/authorize                    │
│     (with redirect_uri=http://localhost:54321/callback)          │
│                                                                  │
│  3. User logs in and authorizes in browser                       │
│                                                                  │
│  4. claude.ai redirects browser to:                              │
│     http://localhost:54321/callback?code=AUTH_CODE&state=STATE   │
│                                                                  │
│  5. Local server receives request, extracts code parameter       │
│                                                                  │
│  6. Uses code to exchange for access_token                       │
│                                                                  │
│  7. Local server closes, browser shows success page              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Security Measures

| Measure | Purpose |
|---------|---------|
| **Localhost binding** | Server only accepts connections from local machine |
| **Random port** | Prevents port prediction attacks |
| **State parameter** | CSRF protection - validates callback is from expected flow |
| **Single request** | Server closes after receiving one valid callback |
| **PKCE** | Prevents authorization code interception |

---

## OAuth 2.0 + PKCE Flow Overview

### What is PKCE?

**PKCE** (Proof Key for Code Exchange, RFC 7636) is a security extension to OAuth 2.0 that prevents authorization code interception attacks.

```
┌─────────────────────────────────────────────────────────────────┐
│                    PKCE Security Flow                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: Client generates random code_verifier                   │
│          code_verifier = random(32 bytes) → base64url            │
│          Example: "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"  │
│                                                                  │
│  Step 2: Client computes code_challenge                          │
│          code_challenge = SHA256(code_verifier) → base64url      │
│          Example: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"  │
│                                                                  │
│  Step 3: Authorization request includes code_challenge           │
│          GET /authorize?code_challenge=E9Mel...&method=S256      │
│                                                                  │
│  Step 4: Server stores challenge, returns auth_code              │
│                                                                  │
│  Step 5: Token exchange includes code_verifier                   │
│          POST /token { code_verifier: "dBjft..." }               │
│                                                                  │
│  Step 6: Server verifies: SHA256(code_verifier) === challenge    │
│          ✓ Match → Issue tokens                                  │
│          ✗ Mismatch → Reject                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Why PKCE is Important

Without PKCE, an attacker who intercepts the authorization code can exchange it for tokens. With PKCE:
- Attacker intercepts `auth_code` ✓
- Attacker doesn't have `code_verifier` ✗
- Attacker cannot derive `code_verifier` from `code_challenge` (SHA256 is one-way)
- Token exchange fails ✓

---

## Implementation Steps

### Step 1: Generate PKCE Parameters

```python
import hashlib
import base64
import secrets

def generate_pkce():
    """
    Generate PKCE code_verifier, code_challenge, and state

    Returns:
        tuple: (code_verifier, code_challenge, state)
    """
    # Generate code_verifier: 32 random bytes → base64url (no padding)
    # Result: 43 characters of high entropy
    code_verifier = base64.urlsafe_b64encode(
        secrets.token_bytes(32)
    ).rstrip(b'=').decode()

    # Generate code_challenge: SHA256(verifier) → base64url
    digest = hashlib.sha256(code_verifier.encode()).digest()
    code_challenge = base64.urlsafe_b64encode(digest).rstrip(b'=').decode()

    # Generate state: random string for CSRF protection
    state = base64.urlsafe_b64encode(
        secrets.token_bytes(32)
    ).rstrip(b'=').decode()

    return code_verifier, code_challenge, state

# Example output:
# code_verifier:  "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"
# code_challenge: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"
# state:          "xyzABCdefGHI123456789_-0987654321abcdefg"
```

### Step 2: Create Local Callback Server

```python
import http.server
import urllib.parse
from threading import Thread

class OAuthCallbackHandler(http.server.BaseHTTPRequestHandler):
    """HTTP request handler for OAuth callback"""

    auth_code = None       # Will store received authorization code
    received_state = None  # Will store received state for validation

    def do_GET(self):
        """Handle GET request (OAuth callback)"""
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)

        if parsed.path == '/callback':
            # Extract code and state from query parameters
            OAuthCallbackHandler.auth_code = params.get('code', [None])[0]
            OAuthCallbackHandler.received_state = params.get('state', [None])[0]

            # Return success page to browser
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(
                b'<html><body>'
                b'<h1>Authorization successful!</h1>'
                b'<p>You can close this tab and return to the terminal.</p>'
                b'</body></html>'
            )
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        """Suppress default logging"""
        pass

def start_callback_server(port=0):
    """
    Start local HTTP server for OAuth callback

    Args:
        port: Port to listen on (0 = random available port)

    Returns:
        tuple: (server, actual_port, thread)
    """
    server = http.server.HTTPServer(
        ('localhost', port),  # Only accept local connections
        OAuthCallbackHandler
    )
    actual_port = server.server_address[1]

    # Run server in background thread
    thread = Thread(target=server.handle_request)
    thread.daemon = True
    thread.start()

    return server, actual_port, thread
```

### Step 3: Build Authorization URL

```python
import urllib.parse

def build_authorization_url(code_challenge, state, port, client_id, login_with_claude_ai=True):
    """
    Build OAuth authorization URL with PKCE parameters

    Args:
        code_challenge: PKCE code challenge (SHA256 of verifier)
        state: Random state for CSRF protection
        port: Local callback server port
        client_id: OAuth client ID
        login_with_claude_ai: True for claude.ai, False for console

    Returns:
        str: Complete authorization URL
    """
    # Select authorization endpoint
    if login_with_claude_ai:
        base_url = "https://claude.ai/oauth/authorize"
    else:
        base_url = "https://console.anthropic.com/oauth/authorize"

    # Build query parameters
    params = {
        "code": "true",
        "client_id": client_id,
        "response_type": "code",
        "redirect_uri": f"http://localhost:{port}/callback",
        "scope": "user:profile user:inference user:sessions:claude_code",
        "code_challenge": code_challenge,
        "code_challenge_method": "S256",
        "state": state
    }

    return f"{base_url}?{urllib.parse.urlencode(params)}"

# Example URL:
# https://claude.ai/oauth/authorize?
#   code=true&
#   client_id=9d1c250a-e61b-44d9-88ed-5944d1962f5e&
#   response_type=code&
#   redirect_uri=http://localhost:54321/callback&
#   scope=user:profile user:inference user:sessions:claude_code&
#   code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&
#   code_challenge_method=S256&
#   state=xyzABCdefGHI123456789_-0987654321abcdefg
```

### Step 4: Open Browser

```python
import webbrowser
import subprocess
import platform

def open_browser(url):
    """
    Open URL in system default browser

    Args:
        url: URL to open

    Returns:
        bool: True if successful
    """
    system = platform.system()

    try:
        if system == "Darwin":  # macOS
            subprocess.run(["open", url], check=True)
        elif system == "Linux":
            subprocess.run(["xdg-open", url], check=True)
        elif system == "Windows":
            subprocess.run(["rundll32", "url,OpenURL", url], check=True)
        else:
            # Fallback to webbrowser module
            webbrowser.open(url)
        return True
    except Exception:
        # Fallback
        return webbrowser.open(url)
```

### Step 5: Exchange Code for Tokens

```python
import requests

def exchange_code_for_tokens(auth_code, code_verifier, state, port, client_id):
    """
    Exchange authorization code for access and refresh tokens

    Args:
        auth_code: Authorization code from callback
        code_verifier: Original PKCE code verifier
        state: State parameter for validation
        port: Local server port (for redirect_uri)
        client_id: OAuth client ID

    Returns:
        dict: Token response containing access_token, refresh_token, etc.
    """
    token_url = "https://console.anthropic.com/v1/oauth/token"

    payload = {
        "grant_type": "authorization_code",
        "code": auth_code,
        "redirect_uri": f"http://localhost:{port}/callback",
        "client_id": client_id,
        "code_verifier": code_verifier,  # PKCE: server verifies this
        "state": state
    }

    response = requests.post(
        token_url,
        json=payload,
        headers={"Content-Type": "application/json"}
    )

    if response.status_code == 200:
        return response.json()
    elif response.status_code == 401:
        raise Exception("Authentication failed: Invalid authorization code")
    else:
        raise Exception(f"Token exchange failed ({response.status_code}): {response.text}")

# Example response:
# {
#   "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "refresh_token": "rt_abc123...",
#   "expires_in": 31536000,  // 1 year in seconds
#   "scope": "user:profile user:inference user:sessions:claude_code",
#   "account": {
#     "uuid": "user_01H...",
#     "email_address": "user@example.com"
#   }
# }
```

### Step 6: Call Claude API with Token

```python
def call_claude_api(access_token, message, model="claude-sonnet-4-20250514"):
    """
    Call Claude API using OAuth access token

    Args:
        access_token: OAuth access token (Bearer token)
        message: User message to send
        model: Model to use

    Returns:
        dict: API response
    """
    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "Authorization": f"Bearer {access_token}",  # OAuth uses Bearer
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        },
        json={
            "model": model,
            "max_tokens": 1024,
            "messages": [{"role": "user", "content": message}]
        }
    )

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"API call failed ({response.status_code}): {response.text}")
```

---

## Complete Python Implementation

```python
#!/usr/bin/env python3
"""
OAuth 2.0 + PKCE Implementation for Claude API
Educational example - demonstrates the complete OAuth flow

WARNING: This uses Claude Code's client_id. For production use,
you should obtain your own client_id from Anthropic or use API keys.
"""

import http.server
import hashlib
import base64
import secrets
import urllib.parse
import webbrowser
import requests
import platform
import subprocess
from threading import Thread, Event

# ============================================
# Configuration
# ============================================

# Claude Code's OAuth client ID (for educational purposes only)
CLIENT_ID = "9d1c250a-e61b-44d9-88ed-5944d1962f5e"

# OAuth endpoints
AUTHORIZE_URL = "https://claude.ai/oauth/authorize"
TOKEN_URL = "https://console.anthropic.com/v1/oauth/token"
API_URL = "https://api.anthropic.com/v1/messages"

# OAuth scopes
SCOPES = "user:profile user:inference user:sessions:claude_code"

# ============================================
# PKCE Functions
# ============================================

def base64url_encode(data: bytes) -> str:
    """Base64 URL-safe encoding without padding"""
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('ascii')

def generate_code_verifier() -> str:
    """Generate PKCE code verifier (32 random bytes → base64url)"""
    return base64url_encode(secrets.token_bytes(32))

def generate_code_challenge(verifier: str) -> str:
    """Generate PKCE code challenge (SHA256 of verifier → base64url)"""
    digest = hashlib.sha256(verifier.encode('ascii')).digest()
    return base64url_encode(digest)

def generate_state() -> str:
    """Generate random state for CSRF protection"""
    return base64url_encode(secrets.token_bytes(32))

# ============================================
# Local Callback Server
# ============================================

class OAuthCallbackHandler(http.server.BaseHTTPRequestHandler):
    """HTTP handler for OAuth callback"""

    auth_code = None
    received_state = None
    callback_received = Event()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == '/callback':
            params = urllib.parse.parse_qs(parsed.query)
            OAuthCallbackHandler.auth_code = params.get('code', [None])[0]
            OAuthCallbackHandler.received_state = params.get('state', [None])[0]

            # Send success response
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()

            html = '''
            <!DOCTYPE html>
            <html>
            <head>
                <title>Authorization Successful</title>
                <style>
                    body { font-family: -apple-system, sans-serif; text-align: center; padding: 50px; }
                    h1 { color: #10a37f; }
                </style>
            </head>
            <body>
                <h1>Authorization Successful!</h1>
                <p>You can close this tab and return to the terminal.</p>
            </body>
            </html>
            '''
            self.wfile.write(html.encode('utf-8'))

            # Signal that callback was received
            OAuthCallbackHandler.callback_received.set()
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass  # Suppress logging

class LocalCallbackServer:
    """Manages the local HTTP server for OAuth callback"""

    def __init__(self):
        self.server = None
        self.port = 0
        self.thread = None

    def start(self, port=0):
        """Start the server on specified port (0 = random)"""
        # Reset state
        OAuthCallbackHandler.auth_code = None
        OAuthCallbackHandler.received_state = None
        OAuthCallbackHandler.callback_received.clear()

        self.server = http.server.HTTPServer(
            ('localhost', port),
            OAuthCallbackHandler
        )
        self.port = self.server.server_address[1]

        # Run in background thread
        self.thread = Thread(target=self._serve)
        self.thread.daemon = True
        self.thread.start()

        return self.port

    def _serve(self):
        """Handle requests until callback received"""
        while not OAuthCallbackHandler.callback_received.is_set():
            self.server.handle_request()

    def wait_for_callback(self, timeout=300):
        """Wait for OAuth callback (default 5 minutes)"""
        return OAuthCallbackHandler.callback_received.wait(timeout)

    def get_auth_code(self):
        """Get the received authorization code"""
        return OAuthCallbackHandler.auth_code

    def get_received_state(self):
        """Get the received state parameter"""
        return OAuthCallbackHandler.received_state

    def close(self):
        """Shutdown the server"""
        if self.server:
            self.server.shutdown()

# ============================================
# OAuth Flow
# ============================================

def build_authorization_url(code_challenge: str, state: str, port: int) -> str:
    """Build the OAuth authorization URL"""
    params = {
        "code": "true",
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": f"http://localhost:{port}/callback",
        "scope": SCOPES,
        "code_challenge": code_challenge,
        "code_challenge_method": "S256",
        "state": state
    }
    return f"{AUTHORIZE_URL}?{urllib.parse.urlencode(params)}"

def open_browser(url: str) -> bool:
    """Open URL in system default browser"""
    system = platform.system()
    try:
        if system == "Darwin":
            subprocess.run(["open", url], check=True)
        elif system == "Linux":
            subprocess.run(["xdg-open", url], check=True)
        elif system == "Windows":
            subprocess.run(["rundll32", "url,OpenURL", url], check=True)
        else:
            webbrowser.open(url)
        return True
    except Exception:
        return webbrowser.open(url)

def exchange_code_for_tokens(auth_code: str, code_verifier: str,
                             state: str, port: int) -> dict:
    """Exchange authorization code for tokens"""
    payload = {
        "grant_type": "authorization_code",
        "code": auth_code,
        "redirect_uri": f"http://localhost:{port}/callback",
        "client_id": CLIENT_ID,
        "code_verifier": code_verifier,
        "state": state
    }

    response = requests.post(
        TOKEN_URL,
        json=payload,
        headers={"Content-Type": "application/json"},
        timeout=30
    )

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Token exchange failed: {response.status_code} - {response.text}")

def call_claude_api(access_token: str, message: str) -> dict:
    """Call Claude API with OAuth token"""
    response = requests.post(
        API_URL,
        headers={
            "Authorization": f"Bearer {access_token}",
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        },
        json={
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 1024,
            "messages": [{"role": "user", "content": message}]
        },
        timeout=60
    )

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"API call failed: {response.status_code} - {response.text}")

# ============================================
# Main OAuth Flow
# ============================================

def run_oauth_flow():
    """Execute the complete OAuth flow"""
    print("=" * 60)
    print("OAuth 2.0 + PKCE Flow for Claude API")
    print("=" * 60)

    # Step 1: Generate PKCE parameters
    print("\n[1/6] Generating PKCE parameters...")
    code_verifier = generate_code_verifier()
    code_challenge = generate_code_challenge(code_verifier)
    state = generate_state()
    print(f"      Code Verifier: {code_verifier[:30]}...")
    print(f"      Code Challenge: {code_challenge[:30]}...")
    print(f"      State: {state[:30]}...")

    # Step 2: Start local callback server
    print("\n[2/6] Starting local callback server...")
    server = LocalCallbackServer()
    port = server.start()
    print(f"      Listening on http://localhost:{port}/callback")

    try:
        # Step 3: Build and open authorization URL
        print("\n[3/6] Opening browser for authorization...")
        auth_url = build_authorization_url(code_challenge, state, port)
        print(f"      URL: {auth_url[:80]}...")

        if not open_browser(auth_url):
            print("\n      Could not open browser automatically.")
            print(f"      Please open this URL manually:\n      {auth_url}")

        # Step 4: Wait for callback
        print("\n[4/6] Waiting for authorization (timeout: 5 minutes)...")
        print("      Please complete the login in your browser.")

        if not server.wait_for_callback(timeout=300):
            raise Exception("Timeout waiting for authorization")

        # Validate state (CSRF protection)
        if server.get_received_state() != state:
            raise Exception("State mismatch - possible CSRF attack!")

        auth_code = server.get_auth_code()
        if not auth_code:
            raise Exception("No authorization code received")

        print(f"      Received authorization code: {auth_code[:20]}...")

        # Step 5: Exchange code for tokens
        print("\n[5/6] Exchanging code for tokens...")
        tokens = exchange_code_for_tokens(auth_code, code_verifier, state, port)

        print(f"      Access Token: {tokens['access_token'][:30]}...")
        print(f"      Refresh Token: {tokens.get('refresh_token', 'N/A')[:30]}...")
        print(f"      Expires In: {tokens.get('expires_in', 'N/A')} seconds")
        print(f"      Scopes: {tokens.get('scope', 'N/A')}")

        # Step 6: Test API call
        print("\n[6/6] Testing API call...")
        response = call_claude_api(tokens['access_token'], "Hello! Please respond with 'OAuth successful!'")

        content = response.get('content', [{}])[0].get('text', 'No response')
        print(f"      Response: {content}")

        print("\n" + "=" * 60)
        print("OAuth flow completed successfully!")
        print("=" * 60)

        return tokens

    finally:
        server.close()

# ============================================
# Entry Point
# ============================================

if __name__ == "__main__":
    print("""
WARNING: This example uses Claude Code's OAuth client_id.
For production applications, you should either:
1. Use API keys from console.anthropic.com (recommended)
2. Contact Anthropic to register your own OAuth client

Press Enter to continue or Ctrl+C to cancel...
""")
    input()

    try:
        tokens = run_oauth_flow()
    except KeyboardInterrupt:
        print("\nCancelled by user")
    except Exception as e:
        print(f"\nError: {e}")
```

---

## API Key vs OAuth Comparison

### When to Use Each

| Aspect | API Key | OAuth |
|--------|---------|-------|
| **Use Case** | Server-side applications, scripts | User-facing applications |
| **Setup** | Simple - just get key from console | Complex - full OAuth flow |
| **Security** | Key must be kept secret | Tokens can be user-specific |
| **User Auth** | No user login needed | User authenticates via browser |
| **Billing** | Tied to API account | Tied to user's subscription |
| **Official Support** | Fully supported | Only for Claude Code |

### API Key Example (Recommended)

```python
from anthropic import Anthropic

# Get API key from console.anthropic.com
client = Anthropic(api_key="sk-ant-api03-xxxxx")

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)

print(response.content[0].text)
```

### OAuth Example

```python
# After completing OAuth flow:
response = requests.post(
    "https://api.anthropic.com/v1/messages",
    headers={
        "Authorization": f"Bearer {access_token}",  # OAuth uses Bearer
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    },
    json={
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 1024,
        "messages": [{"role": "user", "content": "Hello!"}]
    }
)
```

### Header Difference

| Authentication | Header |
|----------------|--------|
| API Key | `X-Api-Key: sk-ant-api03-xxxxx` |
| OAuth Token | `Authorization: Bearer eyJhbG...` |

---

## Important Considerations

### Legal / Terms of Service

| Issue | Description |
|-------|-------------|
| **Client ID** | `9d1c250a-e61b-44d9-88ed-5944d1962f5e` is Claude Code's registered client |
| **Unauthorized Use** | Using this client_id for other applications may violate ToS |
| **Proper Approach** | Contact Anthropic to register your own OAuth application |

### Recommended Approaches

1. **For Personal Scripts**: Use API keys
   ```bash
   # Get from console.anthropic.com
   export ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
   ```

2. **For Applications**: Use official SDK with API key
   ```python
   from anthropic import Anthropic
   client = Anthropic()  # Uses ANTHROPIC_API_KEY env var
   ```

3. **For User-Facing Apps**: Contact Anthropic for:
   - Your own OAuth client registration
   - Proper scopes and permissions
   - Production-ready integration

### Technical Limitations

| Limitation | Description |
|------------|-------------|
| **Browser Required** | User must complete login in browser |
| **Localhost Access** | Callback server must be accessible |
| **Firewall Issues** | Some environments block localhost redirects |
| **Token Expiration** | Access tokens expire (typically 1 year) |
| **Refresh Complexity** | Need to handle token refresh |

---

## Related Documents

- [oauth_authentication.md](./oauth_authentication.md) - Detailed OAuth implementation analysis
- [token_refresh.md](./token_refresh.md) - Token refresh mechanism
- [api_key_auth.md](./api_key_auth.md) - API key authentication (recommended)
- [auth_overview.md](./auth_overview.md) - Authentication architecture overview
