/**
 * @claudecode/cli - OnboardingFlow Component
 * 
 * Main step-by-step onboarding process for new users.
 * Original: hq9 in chunks.154.mjs:2860-2994
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Box, Text, useInput } from 'ink';
import { Select, SpinnerComponent as Spinner } from '@claudecode/ui';
import { analyticsEvent } from '@claudecode/platform/telemetry';
import { LoginFlow } from './LoginFlow.js';
import { getGlobalDispatcher, getUserAgent, shouldUseOAuth } from '@claudecode/platform';

interface OnboardingFlowProps {
  onDone: () => void;
}

interface OnboardingStep {
  id: string;
  component: React.ReactNode;
}

type ConnectivityCheckResult =
  | { success: true }
  | { success: false; error: string };

function useDelayTrue(ms: number): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return ready;
}

/**
 * Preflight connectivity check.
 * Original: GM7 in chunks.154.mjs:2604
 */
async function checkAnthropicConnectivity(): Promise<ConnectivityCheckResult> {
  const urls = [
    'https://api.anthropic.com/api/hello',
    'https://platform.claude.com/v1/oauth/hello',
  ];

  try {
    const tryUrl = async (url: string): Promise<ConnectivityCheckResult> => {
      try {
        const init: any = {
          method: 'GET',
          headers: {
            'User-Agent': getUserAgent(),
          },
        };
        const dispatcher = getGlobalDispatcher();
        if (dispatcher) init.dispatcher = dispatcher;

        const res = await fetch(url, init);
        if (res.status !== 200) {
          return {
            success: false,
            error: `Failed to connect to ${new URL(url).hostname}: Status ${res.status}`,
          };
        }
        return { success: true };
      } catch (err) {
        const details =
          err instanceof Error
            ? ((err as any).code || err.message)
            : String(err);
        return {
          success: false,
          error: `Failed to connect to ${new URL(url).hostname}: ${details}`,
        };
      }
    };

    const results = await Promise.all(urls.map(tryUrl));
    const firstFailure = results.find((r) => !r.success) as ConnectivityCheckResult | undefined;

    if (firstFailure && !firstFailure.success) {
      analyticsEvent('tengu_preflight_check_failed', {
        isConnectivityError: false,
        hasErrorMessage: Boolean(firstFailure.error),
      });
      return firstFailure;
    }

    return { success: true };
  } catch (err) {
    analyticsEvent('tengu_preflight_check_failed', {
      isConnectivityError: true,
    });

    const details =
      err instanceof Error ? ((err as any).code || err.message) : String(err);
    return {
      success: false,
      error: `Connectivity check error: ${details}`,
    };
  }
}

export function OnboardingFlow({ onDone }: OnboardingFlowProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const oauthEnabled = shouldUseOAuth();

  useEffect(() => {
    analyticsEvent('tengu_began_setup', { oauthEnabled });
  }, [oauthEnabled]);

  const nextStep = () => {
    if (stepIndex < steps.length - 1) {
      const nextIdx = stepIndex + 1;
      setStepIndex(nextIdx);
      analyticsEvent('tengu_onboarding_step', {
        oauthEnabled,
        stepId: steps[nextIdx]?.id,
      });
    } else {
      onDone();
    }
  };

  const steps: OnboardingStep[] = useMemo(() => {
    const s: OnboardingStep[] = [];

    // 1. Preflight
    if (oauthEnabled) {
      s.push({
        id: 'preflight',
        component: <PreflightCheck onSuccess={nextStep} />,
      });
    }

    // 2. Theme (Simplified for now)
    s.push({
      id: 'theme',
      component: (
        <Box flexDirection="column" gap={1}>
          <Text bold>Select a theme:</Text>
          <Select
            options={[
              { label: 'Dark', value: 'dark' },
              { label: 'Light', value: 'light' },
            ]}
            onChange={(val: string) => {
              // Save theme here
              nextStep();
            }}
          />
        </Box>
      ),
    });

    // 3. OAuth
    if (oauthEnabled) {
      s.push({
        id: 'oauth',
        component: <LoginFlow onDone={nextStep} />,
      });
    }

    // 4. Security
    s.push({
      id: 'security',
      component: (
        <Box flexDirection="column" gap={1} paddingLeft={1}>
          <Text bold>Security notes:</Text>
          <Box flexDirection="column">
            <Text>• Claude can make mistakes</Text>
            <Text dimColor wrap="wrap">
              You should always review Claude's responses, especially when running code.
            </Text>
            <Box marginTop={1}>
              <Text>• Due to prompt injection risks, only use it with code you trust</Text>
            </Box>
            <Text dimColor wrap="wrap">
              For more details see: https://code.claude.com/docs/en/security
            </Text>
          </Box>
          <Box marginTop={1}>
            <Text dimColor>Press Enter to continue…</Text>
          </Box>
        </Box>
      ),
    });

    return s;
  }, [oauthEnabled, stepIndex]);

  // Handle Enter for steps that just show information
  useInput((input, key) => {
    const currentStep = steps[stepIndex];
    if (key.return && currentStep?.id === 'security') {
      nextStep();
    }
  });

  return (
    <Box flexDirection="column">
      <WelcomeScreen />
      <Box flexDirection="column" marginTop={1}>
        {steps[stepIndex]?.component}
      </Box>
    </Box>
  );
}

function WelcomeScreen() {
  return (
    <Box flexDirection="column">
      <Text color="cyan" bold>Welcome to Claude Code</Text>
      <Text dimColor>…………………………………………………………………………………………………………………………………………………………</Text>
    </Box>
  );
}

function PreflightCheck({ onSuccess }: { onSuccess: () => void }) {
  const [result, setResult] = useState<ConnectivityCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const showSpinner = useDelayTrue(1000) && isLoading;

  useEffect(() => {
    async function check() {
      const r = await checkAnthropicConnectivity();
      setResult(r);
      setIsLoading(false);
    }
    check();
  }, []);

  useEffect(() => {
    if (!result) return;
    if (result.success) {
      onSuccess();
      return;
    }

    // 保持与 source 一致：展示错误后尽快退出（避免继续进入后续 onboarding）。
    const t = setTimeout(() => process.exit(1), 100);
    return () => clearTimeout(t);
  }, [result, onSuccess]);

  if (!result?.success && !isLoading) {
    return (
      <Box flexDirection="column" gap={1} paddingLeft={1}>
        <Text color="red">Unable to connect to Anthropic services</Text>
        <Text color="red">{result?.success === false ? result.error : ''}</Text>
        <Text>Please check your internet connection and network settings.</Text>
        <Text>
          Note: Claude Code might not be available in your country. Check supported countries at{' '}
          <Text color="cyan">https://anthropic.com/supported-countries</Text>
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={1} paddingLeft={1}>
      {showSpinner ? (
        <Box paddingLeft={1}>
          <Spinner />
          <Text> Checking connectivity...</Text>
        </Box>
      ) : null}
    </Box>
  );
}
