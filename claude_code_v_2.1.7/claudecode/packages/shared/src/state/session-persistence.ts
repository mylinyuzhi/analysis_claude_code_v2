/**
 * @claudecode/shared - Session Persistence
 *
 * Session storage, restore, and teleport functionality.
 * Enables cross-device session continuity.
 * Reconstructed from chunks.120.mjs, chunks.148.mjs
 *
 * Key symbols:
 * - Mp → parseSessionLogFile
 * - LP0 → loadSessionIndex
 * - $P0 → writeSessionIndex
 * - Zt → loadOrRestoreSession
 * - mu2 → persistSessionToRemote
 * - Yt → resumeTeleportSession
 */

import { readFileSync, writeFileSync, existsSync, renameSync, statSync, unlinkSync } from 'fs';
import { readFile, writeFile, stat, rename } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import { createHash } from 'crypto';
import { getSessionId, setSessionId, setTeleportedSessionInfo } from './global-state.js';
import type { Message } from '../types/index.js';

// ============================================
// Constants
// ============================================

const SESSION_INDEX_VERSION = 2;
const MAX_RETRIES = 10;
const BASE_DELAY_MS = 500;
const MAX_DELAY_MS = 8000;

// ============================================
// Types
// ============================================

/**
 * Session log entry type
 */
export type SessionLogEntryType =
  | 'user'
  | 'assistant'
  | 'attachment'
  | 'system'
  | 'summary'
  | 'custom-title'
  | 'tag'
  | 'agent-name'
  | 'agent-color'
  | 'file-history-snapshot'
  | 'attribution-snapshot';

/**
 * Session log entry
 */
export interface SessionLogEntry {
  type: SessionLogEntryType;
  uuid?: string;
  parentUuid?: string | null;
  sessionId?: string;
  session_id?: string;
  content?: unknown;
  role?: string;

  // Type-specific fields
  leafUuid?: string;
  summary?: string;
  customTitle?: string;
  tag?: string;
  agentName?: string;
  agentColor?: string;
  messageId?: string;
  isSidechain?: boolean;

  [key: string]: unknown;
}

/**
 * Parsed session data
 */
export interface ParsedSessionData {
  messages: Map<string, SessionLogEntry>;
  summaries: Map<string, string>;
  customTitles: Map<string, string>;
  tags: Map<string, string>;
  agentNames: Map<string, string>;
  agentColors: Map<string, string>;
  fileHistorySnapshots: Map<string, SessionLogEntry>;
  attributionSnapshots: Map<string, SessionLogEntry>;
  leafUuids: Set<string>;
}

/**
 * Session index entry
 */
export interface SessionIndexEntry {
  sessionId: string;
  fullPath: string;
  fileMtime: number;
  customTitle?: string;
  tag?: string;
  agentName?: string;
  agentColor?: string;
}

/**
 * Session index data
 */
export interface SessionIndexData {
  version: number;
  entries: SessionIndexEntry[];
}

/**
 * Loaded session result
 */
export interface LoadedSessionResult {
  messages: Message[];
  fileHistorySnapshots?: Map<string, SessionLogEntry>;
  attributionSnapshots?: Map<string, SessionLogEntry>;
  sessionId?: string;
}

/**
 * Teleport result
 */
export interface TeleportResult {
  log: SessionLogEntry[];
  branch?: string;
}

// ============================================
// Path Functions
// ============================================

/**
 * Get the Claude home directory (~/.claude).
 * Original: zQ() in chunks.148.mjs
 */
export function getCacheDir(): string {
  return join(homedir(), '.claude');
}

/**
 * Get the projects root directory
 * Original: wp in chunks.148.mjs:679-681
 */
export function getProjectsRoot(): string {
  return join(getCacheDir(), 'projects');
}

/**
 * Sanitize a project root path to a stable directory name.
 * Original: gGA() in chunks.20.mjs
 */
export function sanitizeProjectRoot(projectRoot: string): string {
  return projectRoot.replace(/[^a-zA-Z0-9]/g, '-');
}

/**
 * Legacy: Get project directory hash.
 * NOTE: Original Claude Code uses sanitized project root (gGA), not a hash.
 */
export function getProjectHash(projectRoot: string): string {
  return createHash('sha256').update(projectRoot).digest('hex').slice(0, 16);
}

/**
 * Get the project directory for session storage
 * Original: QV in chunks.148.mjs
 */
export function getProjectDir(projectRoot: string): string {
  return join(getProjectsRoot(), sanitizeProjectRoot(projectRoot));
}

/**
 * Get current session path
 * Original: uz in chunks.148.mjs:683-686
 */
export function getCurrentSessionPath(projectRoot: string): string {
  return getSessionPath(getSessionId(), projectRoot);
}

/**
 * Get session path by session ID
 * Original: Bw in chunks.148.mjs:688-692
 */
export function getSessionPath(sessionId: string, projectRoot: string): string {
  const projectDir = getProjectDir(projectRoot);
  return join(projectDir, `${sessionId}.jsonl`);
}

/**
 * Get session index path
 */
export function getSessionIndexPath(projectDir: string): string {
  return join(projectDir, '.session_index.json');
}

// ============================================
// JSONL Utilities
// ============================================

/**
 * Read a JSONL file and parse entries
 */
export async function readJsonlFile(filePath: string): Promise<SessionLogEntry[]> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const lines = content.split('\n').filter((line) => line.trim() !== '');
    const entries: SessionLogEntry[] = [];

    for (const line of lines) {
      try {
        entries.push(JSON.parse(line));
      } catch {
        // Skip malformed lines
      }
    }

    return entries;
  } catch {
    return [];
  }
}

/**
 * Read a JSONL file synchronously
 */
export function readJsonlFileSync(filePath: string): SessionLogEntry[] {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter((line) => line.trim() !== '');
    const entries: SessionLogEntry[] = [];

    for (const line of lines) {
      try {
        entries.push(JSON.parse(line));
      } catch {
        // Skip malformed lines
      }
    }

    return entries;
  } catch {
    return [];
  }
}

/**
 * Append entry to JSONL file
 */
export async function appendJsonlEntry(
  filePath: string,
  entry: SessionLogEntry
): Promise<void> {
  const line = JSON.stringify(entry) + '\n';
  await writeFile(filePath, line, { flag: 'a' });
}

// ============================================
// Session Parsing
// ============================================

/**
 * Check if an entry is a valid session message
 * Original: pbA in chunks.148.mjs:675-677
 */
export function isValidSessionMessage(entry: SessionLogEntry): boolean {
  return (
    entry.type === 'user' ||
    entry.type === 'assistant' ||
    entry.type === 'attachment' ||
    entry.type === 'system'
  );
}

/**
 * Parse session log file into structured data
 * Original: Mp in chunks.148.mjs:1352-1386
 */
export async function parseSessionLogFile(
  filePath: string
): Promise<ParsedSessionData> {
  const messages = new Map<string, SessionLogEntry>();
  const summaries = new Map<string, string>();
  const customTitles = new Map<string, string>();
  const tags = new Map<string, string>();
  const agentNames = new Map<string, string>();
  const agentColors = new Map<string, string>();
  const fileHistorySnapshots = new Map<string, SessionLogEntry>();
  const attributionSnapshots = new Map<string, SessionLogEntry>();

  try {
    const entries = await readJsonlFile(filePath);

    for (const entry of entries) {
      switch (entry.type) {
        case 'user':
        case 'assistant':
        case 'attachment':
        case 'system':
          if (entry.uuid) {
            messages.set(entry.uuid, entry);
          }
          break;

        case 'summary':
          if (entry.leafUuid && entry.summary) {
            summaries.set(entry.leafUuid, entry.summary);
          }
          break;

        case 'custom-title':
          if (entry.sessionId && entry.customTitle) {
            customTitles.set(entry.sessionId, entry.customTitle);
          }
          break;

        case 'tag':
          if (entry.sessionId && entry.tag) {
            tags.set(entry.sessionId, entry.tag);
          }
          break;

        case 'agent-name':
          if (entry.sessionId && entry.agentName) {
            agentNames.set(entry.sessionId, entry.agentName);
          }
          break;

        case 'agent-color':
          if (entry.sessionId && entry.agentColor) {
            agentColors.set(entry.sessionId, entry.agentColor);
          }
          break;

        case 'file-history-snapshot':
          if (entry.messageId) {
            fileHistorySnapshots.set(entry.messageId, entry);
          }
          break;

        case 'attribution-snapshot':
          if (entry.messageId) {
            attributionSnapshots.set(entry.messageId, entry);
          }
          break;
      }
    }
  } catch {
    // Return empty data on error
  }

  // Build leaf UUID set (messages without children)
  const parentUuids = new Set(
    [...messages.values()].map((m) => m.parentUuid).filter((p): p is string => p !== null && p !== undefined)
  );
  const leafUuids = new Set([...messages.keys()].filter((k) => !parentUuids.has(k)));

  return {
    messages,
    summaries,
    customTitles,
    tags,
    agentNames,
    agentColors,
    fileHistorySnapshots,
    attributionSnapshots,
    leafUuids,
  };
}

// ============================================
// Session Index Management
// ============================================

/**
 * Load session index from disk
 * Original: LP0 in chunks.148.mjs:1595-1610
 */
export function loadSessionIndex(projectDir: string): SessionIndexData | null {
  const indexPath = getSessionIndexPath(projectDir);

  if (!existsSync(indexPath)) {
    return null;
  }

  try {
    const data = JSON.parse(readFileSync(indexPath, 'utf-8'));

    if (data.version !== SESSION_INDEX_VERSION || !Array.isArray(data.entries)) {
      return null;
    }

    return data as SessionIndexData;
  } catch {
    return null;
  }
}

/**
 * Load session index asynchronously
 */
export async function loadSessionIndexAsync(
  projectDir: string
): Promise<SessionIndexData | null> {
  const indexPath = getSessionIndexPath(projectDir);

  try {
    const content = await readFile(indexPath, 'utf-8');
    const data = JSON.parse(content);

    if (data.version !== SESSION_INDEX_VERSION || !Array.isArray(data.entries)) {
      return null;
    }

    return data as SessionIndexData;
  } catch {
    return null;
  }
}

/**
 * Write session index to disk (atomic write)
 * Original: $P0 in chunks.148.mjs:1612-1625
 */
export function writeSessionIndex(
  projectDir: string,
  indexData: SessionIndexData
): void {
  const indexPath = getSessionIndexPath(projectDir);
  const tempPath = indexPath + '.tmp';

  try {
    // Atomic write with temp file
    writeFileSync(tempPath, JSON.stringify(indexData, null, 2), {
      encoding: 'utf-8',
    });

    // Atomic rename
    renameSync(tempPath, indexPath);
  } catch (error) {
    // Clean up temp file on error
    try {
      if (existsSync(tempPath)) {
        unlinkSync(tempPath);
      }
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

/**
 * Write session index asynchronously (atomic write)
 */
export async function writeSessionIndexAsync(
  projectDir: string,
  indexData: SessionIndexData
): Promise<void> {
  const indexPath = getSessionIndexPath(projectDir);
  const tempPath = indexPath + '.tmp';

  try {
    await writeFile(tempPath, JSON.stringify(indexData, null, 2), {
      encoding: 'utf-8',
    });
    await rename(tempPath, indexPath);
  } catch (error) {
    // Clean up temp file on error
    try {
      const { unlink } = await import('fs/promises');
      await unlink(tempPath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

/**
 * Update a session index entry
 * Original: y$7 in chunks.148.mjs:1627-1648
 */
export function updateSessionIndexEntry(
  projectDir: string,
  sessionId: string,
  updates: Partial<Pick<SessionIndexEntry, 'customTitle' | 'tag' | 'agentName' | 'agentColor'>>
): void {
  const index = loadSessionIndex(projectDir);
  if (!index) return;

  const entry = index.entries.find((e) => e.sessionId === sessionId);
  if (!entry) return;

  // Apply updates
  if (updates.customTitle !== undefined) entry.customTitle = updates.customTitle;
  if (updates.tag !== undefined) entry.tag = updates.tag;
  if (updates.agentName !== undefined) entry.agentName = updates.agentName;
  if (updates.agentColor !== undefined) entry.agentColor = updates.agentColor;

  // Update mtime
  try {
    const stats = statSync(entry.fullPath);
    entry.fileMtime = stats.mtimeMs;
  } catch {
    // Ignore stat errors
  }

  writeSessionIndex(projectDir, index);
}

/**
 * Add a new session to the index
 */
export function addSessionToIndex(
  projectDir: string,
  sessionId: string,
  fullPath: string
): void {
  let index = loadSessionIndex(projectDir);

  if (!index) {
    index = {
      version: SESSION_INDEX_VERSION,
      entries: [],
    };
  }

  // Check if session already exists
  const existingIndex = index.entries.findIndex((e) => e.sessionId === sessionId);

  const stats = statSync(fullPath);
  const entry: SessionIndexEntry = {
    sessionId,
    fullPath,
    fileMtime: stats.mtimeMs,
  };

  if (existingIndex >= 0) {
    // Update existing entry
    index.entries[existingIndex] = {
      ...index.entries[existingIndex],
      ...entry,
    };
  } else {
    // Add new entry
    index.entries.push(entry);
  }

  writeSessionIndex(projectDir, index);
}

// ============================================
// Session Loading
// ============================================

/**
 * Get the latest session from index
 * Original: xu2 in chunks.120.mjs
 */
export async function getLatestSession(
  projectDir: string,
  _offset = 0
): Promise<ParsedSessionData | null> {
  const index = await loadSessionIndexAsync(projectDir);
  if (!index || index.entries.length === 0) {
    return null;
  }

  // Sort by mtime descending
  const sorted = [...index.entries].sort((a, b) => b.fileMtime - a.fileMtime);
  const latest = sorted[0];

  if (!latest || !existsSync(latest.fullPath)) {
    return null;
  }

  return parseSessionLogFile(latest.fullPath);
}

/**
 * Load a specific session from disk
 * Original: Gq0 in chunks.148.mjs:1397-1414
 */
export async function loadSessionFromDisk(
  sessionId: string,
  projectDir: string
): Promise<ParsedSessionData | null> {
  const sessionPath = getSessionPath(sessionId, projectDir);

  if (!existsSync(sessionPath)) {
    return null;
  }

  return parseSessionLogFile(sessionPath);
}

/**
 * Convert session entry to internal message format
 */
export function convertToInternalFormat(entry: SessionLogEntry): Message | null {
  if (entry.type !== 'user' && entry.type !== 'assistant') {
    return null;
  }

  return {
    role: entry.type as 'user' | 'assistant',
    content: entry.content as string | Message['content'],
  };
}

/**
 * Load or restore a session
 * Original: Zt in chunks.120.mjs:2608-2643
 */
export async function loadOrRestoreSession(
  sessionIdOrLogs: string | SessionLogEntry[] | undefined,
  projectDir: string
): Promise<LoadedSessionResult | null> {
  try {
    let loadedSession: ParsedSessionData | null = null;
    let messages: Message[] | null = null;
    let finalSessionId: string | undefined;

    if (sessionIdOrLogs === undefined) {
      // CASE 1: Load latest session
      loadedSession = await getLatestSession(projectDir);
    } else if (Array.isArray(sessionIdOrLogs)) {
      // CASE 2: Convert API logs to messages
      messages = [];
      for (const entry of sessionIdOrLogs) {
        if (entry.type === 'assistant' || entry.type === 'user') {
          const message = convertToInternalFormat(entry);
          if (message) messages.push(message);
        }
        finalSessionId = entry.session_id || entry.sessionId;
      }
    } else if (typeof sessionIdOrLogs === 'string') {
      // CASE 3: Load specific session by ID
      loadedSession = await loadSessionFromDisk(sessionIdOrLogs, projectDir);
      finalSessionId = sessionIdOrLogs;
    }

    if (!loadedSession && !messages) {
      return null;
    }

    if (loadedSession) {
      // Extract session ID from messages if not set
      if (!finalSessionId) {
        const firstMessage = [...loadedSession.messages.values()][0];
        finalSessionId = firstMessage?.sessionId || firstMessage?.session_id;
      }

      // Convert messages map to array
      messages = [...loadedSession.messages.values()]
        .map(convertToInternalFormat)
        .filter((m): m is Message => m !== null);
    }

    if (!messages) {
      return null;
    }

    // Update global session ID
    if (finalSessionId) {
      setSessionId(finalSessionId);
    }

    return {
      messages,
      fileHistorySnapshots: loadedSession?.fileHistorySnapshots,
      attributionSnapshots: loadedSession?.attributionSnapshots,
      sessionId: finalSessionId,
    };
  } catch (error) {
    console.error('Failed to load session:', error);
    return null;
  }
}

// ============================================
// Remote Persistence
// ============================================

/**
 * UUID tracking for optimistic locking
 */
const lastUuidMap = new Map<string, string>();

/**
 * Persist a session log entry to remote
 * Original: Qi5 in chunks.120.mjs:2965-3002
 */
export async function persistSessionLogEntry(
  sessionId: string,
  messageData: SessionLogEntry,
  apiUrl: string,
  headers: Record<string, string>
): Promise<boolean> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Add optimistic locking header
      const requestHeaders = { ...headers };
      const lastUuid = lastUuidMap.get(sessionId);
      if (lastUuid) {
        requestHeaders['Last-Uuid'] = lastUuid;
      }

      // HTTP PUT request
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: requestHeaders,
        body: JSON.stringify(messageData),
      });

      // Success
      if (response.status === 200 || response.status === 201) {
        if (messageData.uuid) {
          lastUuidMap.set(sessionId, messageData.uuid);
        }
        return true;
      }

      // Conflict (409) - concurrent modification
      if (response.status === 409) {
        const xLastUuid = response.headers.get('x-last-uuid');
        if (xLastUuid === messageData.uuid) {
          // Already persisted, recover from stale state
          if (messageData.uuid) {
            lastUuidMap.set(sessionId, messageData.uuid);
          }
          return true;
        }
        // Actual conflict
        return false;
      }

      // Unauthorized (401) - token expired
      if (response.status === 401) {
        return false;
      }

      // Server error, will retry
      if (response.status >= 500) {
        // Fall through to retry
      } else {
        // Client error (4xx), don't retry
        return false;
      }
    } catch {
      // Network error, will retry
    }

    // Exhausted retries
    if (attempt === MAX_RETRIES) {
      return false;
    }

    // Exponential backoff
    const delay = Math.min(BASE_DELAY_MS * Math.pow(2, attempt - 1), MAX_DELAY_MS);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return false;
}

/**
 * Get JWT token for API authentication
 */
function getJwtToken(): string | null {
  // This would typically come from the auth module
  return process.env.CLAUDE_SESSION_TOKEN || null;
}

/**
 * Persist session to remote API
 * Original: mu2 in chunks.120.mjs:3004-3012
 */
export async function persistSessionToRemote(
  sessionId: string,
  messageData: SessionLogEntry,
  remoteUrl: string
): Promise<boolean> {
  const jwtToken = getJwtToken();
  if (!jwtToken) {
    return false;
  }

  const headers = {
    Authorization: `Bearer ${jwtToken}`,
    'Content-Type': 'application/json',
  };

  return persistSessionLogEntry(sessionId, messageData, remoteUrl, headers);
}

// ============================================
// Teleport
// ============================================

/**
 * Teleport error class
 */
export class TeleportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TeleportError';
  }
}

/**
 * Fetch session logs from remote API
 * Original: pu2 in chunks.120.mjs
 */
async function fetchSessionLogs(
  sessionId: string,
  accessToken: string,
  orgUuid: string
): Promise<SessionLogEntry[] | null> {
  try {
    const url = `https://api.claude.ai/api/organizations/${orgUuid}/sessions/${sessionId}/logs`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as unknown;
    return Array.isArray(data) ? (data as SessionLogEntry[]) : null;
  } catch {
    return null;
  }
}

/**
 * Teleport from Sessions API
 * Original: Vi5 in chunks.120.mjs:3349-3373
 */
async function teleportFromSessionsAPI(
  sessionId: string,
  orgUuid: string,
  accessToken: string,
  progressCallback?: (status: string) => void,
  _sessionData?: unknown
): Promise<TeleportResult> {
  progressCallback?.('fetching_logs');

  // Fetch session logs
  const logs = await fetchSessionLogs(sessionId, accessToken, orgUuid);
  if (logs === null) {
    throw new Error('Failed to fetch session logs');
  }

  // Filter to conversation messages only
  const messages = logs.filter(
    (entry) => isValidSessionMessage(entry) && !entry.isSidechain
  );

  progressCallback?.('fetching_branch');

  return {
    log: messages,
    branch: undefined,
  };
}

/**
 * Resume a teleported session
 * Original: Yt in chunks.120.mjs:3274-3320
 */
export async function resumeTeleportSession(
  sessionId: string,
  progressCallback?: (status: string) => void
): Promise<TeleportResult> {
  try {
    // STEP 1: Check authentication
    const accessToken = process.env.CLAUDE_ACCESS_TOKEN;
    if (!accessToken) {
      throw new TeleportError('Requires Claude.ai authentication, not API key');
    }

    // STEP 2: Get organization UUID
    const orgUuid = process.env.CLAUDE_ORG_UUID;
    if (!orgUuid) {
      throw new TeleportError('Unable to get organization UUID');
    }

    progressCallback?.('validating');

    // STEP 3: Fetch and return session logs
    const result = await teleportFromSessionsAPI(
      sessionId,
      orgUuid,
      accessToken,
      progressCallback
    );

    // Update global state
    setTeleportedSessionInfo({ sessionId });

    return result;
  } catch (error) {
    if (error instanceof TeleportError) {
      throw error;
    }
    throw new TeleportError(error instanceof Error ? error.message : String(error));
  }
}

// Note: functions/constants are exported at their declarations.
