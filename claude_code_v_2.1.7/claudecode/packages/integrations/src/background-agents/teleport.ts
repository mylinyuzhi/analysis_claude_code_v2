/**
 * @claudecode/integrations - Teleport (Remote Session) Utilities
 *
 * Reconstructed from chunks.120.mjs
 */

import { getApiKey } from '@claudecode/platform';

/**
 * Fetch remote session logs (events).
 * Original: nu2 in chunks.120.mjs:3375-3406
 */
export async function fetchRemoteSessionLogs(sessionId: string): Promise<{ log: any[], branch?: string }> {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error('No API key found for remote session polling');

  const orgUuid = process.env.CLAUDE_ORG_UUID;
  if (!orgUuid) throw new Error('No organization UUID for polling');

  const baseUrl = process.env.CLAUDE_BASE_API_URL || 'https://api.claude.ai';
  const url = `${baseUrl}/v1/sessions/${sessionId}/events`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'x-organization-uuid': orgUuid,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch session events: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data?.data || !Array.isArray(data.data)) {
    throw new Error('Invalid events response');
  }

  // Filter events
  const logs = data.data.filter((d: any) => {
    if (!d || typeof d !== 'object' || !('type' in d)) return false;
    if (d.type === 'env_manager_log' || d.type === 'control_response') return false;
    return 'session_id' in d;
  });

  return { log: logs };
}

/**
 * Create a remote session.
 * Original: cbA in chunks.120.mjs:3408-3470
 */
export async function createRemoteSession(options: {
  initialMessage: string;
  description: string;
  signal?: AbortSignal;
}): Promise<{ id: string; title?: string } | null> {
  const { initialMessage, description, signal } = options;

  const apiKey = await getApiKey();
  if (!apiKey) return null;

  const orgUuid = process.env.CLAUDE_ORG_UUID;
  if (!orgUuid) return null;

  const baseUrl = process.env.CLAUDE_BASE_API_URL || 'https://api.claude.ai';
  const url = `${baseUrl}/v1/sessions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'x-organization-uuid': orgUuid,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      initial_message: initialMessage,
      description,
      // Simplified sources/outcomes for now as per original logic
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to create remote session: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    id: data.id,
    title: data.title,
  };
}
