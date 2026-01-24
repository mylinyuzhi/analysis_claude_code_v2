/**
 * @claudecode/cli - LoginFlow Component
 * 
 * Interactive OAuth login flow for Claude Code.
 * Original: _s in chunks.109.mjs:1562-1869
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import { Select, TextInput, SpinnerComponent as Spinner } from '@claudecode/ui';
import { 
  OAuthManager, 
  saveOAuthTokens, 
  getOAuthAccount,
  fetchUserRoles,
  createApiKey
} from '@claudecode/platform';
import { analyticsEvent, logError } from '@claudecode/platform/telemetry';

type LoginState = 
  | { state: 'idle' }
  | { state: 'ready_to_start' }
  | { state: 'waiting_for_login'; url: string }
  | { state: 'creating_api_key' }
  | { state: 'success'; token?: string }
  | { state: 'error'; message: string; toRetry?: LoginState }
  | { state: 'about_to_retry'; nextState: LoginState };

interface LoginFlowProps {
  onDone: () => void;
  startingMessage?: string;
  mode?: 'login' | 'setup-token';
  forceLoginMethod?: 'claudeai' | 'console';
}

export function LoginFlow({
  onDone,
  startingMessage,
  mode = 'login',
  forceLoginMethod,
}: LoginFlowProps) {
  const [loginState, setLoginState] = useState<LoginState>(() => {
    if (mode === 'setup-token' || forceLoginMethod) {
      return { state: 'ready_to_start' };
    }
    return { state: 'idle' };
  });

  const [manualCode, setManualCode] = useState('');
  const [cursorOffset, setCursorOffset] = useState(0);
  const [oauthManager] = useState(() => new OAuthManager());
  const [loginWithClaudeAi, setLoginWithClaudeAi] = useState(() => 
    mode === 'setup-token' || forceLoginMethod === 'claudeai'
  );
  const [showManualInput, setShowManualInput] = useState(false);
  const isStarting = useRef(false);

  // Keyboard handling for success/error screens
  useInput((input, key) => {
    if (key.return) {
      if (loginState.state === 'success' && mode !== 'setup-token') {
        analyticsEvent('tengu_oauth_success', { loginWithClaudeAi });
        onDone();
      } else if (loginState.state === 'error' && loginState.toRetry) {
        setManualCode('');
        setLoginState({
          state: 'about_to_retry',
          nextState: loginState.toRetry,
        });
      }
    }
  });

  useEffect(() => {
    if (loginState.state === 'about_to_retry') {
      const timer = setTimeout(() => {
        setLoginState(loginState.nextState);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loginState]);

  const handleManualCodeSubmit = async (code: string) => {
    try {
      const [authorizationCode, state] = code.split('#');
      if (!authorizationCode || !state) {
        setLoginState({
          state: 'error',
          message: 'Invalid code. Please make sure the full code was copied',
          toRetry: loginState,
        });
        return;
      }

      analyticsEvent('tengu_oauth_manual_entry', {});
      oauthManager.handleManualAuthCodeInput({ authorizationCode, state });
    } catch (err) {
      logError(err instanceof Error ? err : Error(String(err)));
      setLoginState({
        state: 'error',
        message: err instanceof Error ? err.message : String(err),
        toRetry: loginState,
      });
    }
  };

  const startLogin = useCallback(async () => {
    try {
      analyticsEvent('tengu_oauth_flow_start', { loginWithClaudeAi });
      
      const tokens = await oauthManager.startOAuthFlow(async (url) => {
        setLoginState({ state: 'waiting_for_login', url });
        setTimeout(() => setShowManualInput(true), 3000);
      }, {
        loginWithClaudeAi,
        inferenceOnly: mode === 'setup-token',
        expiresIn: mode === 'setup-token' ? 31536000 : undefined,
      });

      if (mode === 'setup-token') {
        setLoginState({ state: 'success', token: tokens.accessToken });
      } else {
        // Fetch roles and create API key if needed
        await fetchUserRoles(tokens.accessToken).catch((err) => {
          logError(err);
          // Don't fail the whole flow if roles fetch fails, but log it
        });

        const hasInferenceScope = tokens.scopes?.includes('user:inference');
        if (!hasInferenceScope) {
          setLoginState({ state: 'creating_api_key' });
          await createApiKey(tokens.accessToken).catch((err) => {
            throw new Error('Failed to create API key: ' + err.message);
          });
        }

        saveOAuthTokens(tokens);
        setLoginState({ state: 'success' });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setLoginState({
        state: 'error',
        message: message.includes('Token exchange failed') 
          ? 'Failed to exchange authorization code for access token. Please try again.' 
          : message,
        toRetry: mode === 'setup-token' ? { state: 'ready_to_start' } : { state: 'idle' },
      });
      analyticsEvent('tengu_oauth_error', { error: message });
    }
  }, [oauthManager, loginWithClaudeAi, mode]);

  useEffect(() => {
    if (loginState.state === 'ready_to_start' && !isStarting.current) {
      isStarting.current = true;
      startLogin();
    }
  }, [loginState.state, startLogin]);

  useEffect(() => {
    return () => oauthManager.cleanup();
  }, [oauthManager]);

  const renderContent = () => {
    switch (loginState.state) {
      case 'idle':
        return (
          <Box flexDirection="column" gap={1} marginTop={1}>
            <Text bold>
              {startingMessage || "Claude Code can be used with your Claude subscription or billed based on API usage through your Console account."}
            </Text>
            <Text>Select login method:</Text>
            <Box>
              <Select
                options={[
                  {
                    label: (
                      <Text>
                        Claude account with subscription · <Text dimColor>Pro, Max, Team, or Enterprise</Text>
                      </Text>
                    ),
                    value: 'claudeai',
                  },
                  {
                    label: (
                      <Text>
                        Anthropic Console account · <Text dimColor>API usage billing</Text>
                      </Text>
                    ),
                    value: 'console',
                  },
                ]}
                onChange={(val: string) => {
                  setLoginWithClaudeAi(val === 'claudeai');
                  setLoginState({ state: 'ready_to_start' });
                  analyticsEvent(val === 'claudeai' ? 'tengu_oauth_claudeai_selected' : 'tengu_oauth_console_selected', {});
                }}
              />
            </Box>
          </Box>
        );

      case 'waiting_for_login':
        return (
          <Box flexDirection="column" gap={1}>
            {forceLoginMethod && (
              <Box>
                <Text dimColor>
                  {forceLoginMethod === 'claudeai' 
                    ? "Login method pre-selected: Subscription Plan (Claude Pro/Max)" 
                    : "Login method pre-selected: API Usage Billing (Anthropic Console)"}
                </Text>
              </Box>
            )}
            {!showManualInput ? (
              <Box>
                <Spinner />
                <Text> Opening browser to sign in…</Text>
              </Box>
            ) : (
              <Box flexDirection="column" gap={1}>
                <Box paddingX={1}>
                  <Text dimColor>Browser didn't open? Use the url below to sign in:</Text>
                </Box>
                <Box paddingLeft={2}>
                  <Text dimColor>{loginState.url}</Text>
                </Box>
                <Box>
                  <Text>Paste code here if prompted {'>'} </Text>
                  <TextInput
                    value={manualCode}
                    onChange={setManualCode}
                    onSubmit={handleManualCodeSubmit}
                  />
                </Box>
              </Box>
            )}
          </Box>
        );

      case 'creating_api_key':
        return (
          <Box flexDirection="column" gap={1}>
            <Box>
              <Spinner />
              <Text> Creating API key for Claude Code…</Text>
            </Box>
          </Box>
        );

      case 'about_to_retry':
        return (
          <Box flexDirection="column" gap={1}>
            <Text color="blue">Retrying…</Text>
          </Box>
        );

      case 'success':
        return (
          <Box flexDirection="column">
            {mode === 'setup-token' && loginState.token ? (
              <Box flexDirection="column" gap={1} paddingTop={1}>
                <Text color="green">✓ Long-lived authentication token created successfully!</Text>
                <Box flexDirection="column" gap={1}>
                  <Text>Your OAuth token (valid for 1 year):</Text>
                  <Box paddingLeft={2}>
                    <Text color="yellow">{loginState.token}</Text>
                  </Box>
                  <Text dimColor>Store this token securely. You won't be able to see it again.</Text>
                  <Text dimColor>Use this token by setting: export CLAUDE_CODE_OAUTH_TOKEN=&lt;token&gt;</Text>
                </Box>
              </Box>
            ) : (
              <>
                {getOAuthAccount()?.emailAddress && (
                  <Text dimColor>Logged in as <Text>{getOAuthAccount()?.emailAddress}</Text></Text>
                )}
                <Text color="green">Login successful. Press <Text bold>Enter</Text> to continue…</Text>
              </>
            )}
          </Box>
        );

      case 'error':
        return (
          <Box flexDirection="column" gap={1}>
            <Text color="red">OAuth error: {loginState.message}</Text>
            {loginState.toRetry && (
              <Box marginTop={1}>
                <Text color="blue">Press <Text bold>Enter</Text> to retry.</Text>
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box flexDirection="column" gap={1} paddingLeft={1}>
      {renderContent()}
    </Box>
  );
}
