/**
 * @claudecode/cli - Setup Screens
 * 
 * Gatekeeper for showing onboarding and initial setup screens.
 * Original: $L9 in chunks.156.mjs:1589-1686
 */

import React from 'react';
import { render } from 'ink';
import { OnboardingFlow } from '../components/Onboarding/OnboardingFlow.js';
import { InternalApp } from '@claudecode/ui';
import { loadUserSettings, updateUserSettings } from '../settings/loader.js';
import { isClaudeAiOAuth } from '@claudecode/platform';

/**
 * Show setup screens if needed.
 * Returns true if onboarding was shown.
 */
export async function showSetupScreens(
  bypassPermissions: boolean = false,
  forceSetup: boolean = false,
  commands: any[] = [],
  isChrome: boolean = false
): Promise<boolean> {
  // If in CI or demo mode, skip
  if (process.env.CI === 'true' || process.env.IS_DEMO === '1') {
    return false;
  }

  const settings = loadUserSettings();
  let onboardingShown = false;

  // 1. Core Onboarding (Theme + Login)
  if (!settings.theme || !settings.hasCompletedOnboarding || forceSetup) {
    onboardingShown = true;
    
    const { waitUntilExit } = render(
      React.createElement(InternalApp, {
        terminalColumns: process.stdout.columns || 80,
        terminalRows: process.stdout.rows || 24,
        ink2: false,
        stdin: process.stdin,
        stdout: process.stdout,
        exitOnCtrlC: true,
      }, React.createElement(OnboardingFlow, {
        onDone: () => {
          updateUserSettings({ hasCompletedOnboarding: true });
        }
      }))
    );

    await waitUntilExit();
  }

  // 2. Folder Trust Check (Simplified for now)
  // Original: BN9 (TrustFlow)
  
  // 3. Policy Update Check (Simplified for now)
  // Original: bz1 (PolicyUpdateFlow)

  return onboardingShown;
}
