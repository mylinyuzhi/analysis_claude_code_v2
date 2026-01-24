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
import { shouldUseOAuth } from '@claudecode/platform';

interface OnboardingFlowProps {
  onDone: () => void;
}

interface OnboardingStep {
  id: string;
  component: React.ReactNode;
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
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      try {
        // Mock connectivity check for now
        // In real it calls GM7
        setStatus('success');
        onSuccess();
      } catch (err) {
        setStatus('error');
        setError(String(err));
      }
    }
    check();
  }, [onSuccess]);

  if (status === 'error') {
    return (
      <Box flexDirection="column" gap={1} paddingLeft={1}>
        <Text color="red">Unable to connect to Anthropic services</Text>
        <Text color="red">{error}</Text>
        <Text>Please check your internet connection and network settings.</Text>
      </Box>
    );
  }

  return (
    <Box paddingLeft={1}>
      <Spinner />
      <Text> Checking connectivity...</Text>
    </Box>
  );
}
