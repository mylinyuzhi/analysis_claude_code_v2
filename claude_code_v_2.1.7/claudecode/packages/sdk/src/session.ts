/**
 * @claudecode/sdk - Session Utilities
 *
 * Session loading and transport creation.
 * Reconstructed from chunks.155.mjs, chunks.156.mjs
 */

import { StdioSDKTransport, WebSocketSDKTransport } from './transport/index.js';
import { Readable } from 'stream';

/**
 * Determine resume source type from argument.
 * Corresponds to obfuscated symbol vw9 in chunks.155.mjs.
 */
export function parseResumeTarget(resumeArg: string) {
  // 1. Try as URL (WebSocket reconnect)
  try {
    const url = new URL(resumeArg);
    return {
      sessionId: crypto.randomUUID(),
      ingressUrl: url.href,
      isUrl: true,
      jsonlFile: null,
      isJsonlFile: false
    };
  } catch {}

  // 2. Check if valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(resumeArg)) {
    return {
      sessionId: resumeArg,
      ingressUrl: null,
      isUrl: false,
      jsonlFile: null,
      isJsonlFile: false
    };
  }

  // 3. Check if .jsonl file
  if (resumeArg.endsWith(".jsonl")) {
    return {
      sessionId: crypto.randomUUID(),
      ingressUrl: null,
      isUrl: false,
      jsonlFile: resumeArg,
      isJsonlFile: true
    };
  }

  return null;
}

/**
 * Loads initial messages for session resumption.
 * Corresponds to obfuscated symbol jR7 in chunks.156.mjs.
 */
export async function loadInitialMessages(setAppState: (update: (state: any) => any) => void, options: any): Promise<any[]> {
  // cAA is isSessionPersistenceDisabled
  const isPersistenceEnabled = !(global as any).isSessionPersistenceDisabled?.();
  
  // Helper to set session ID and sync
  const setSession = async (sessionId: string) => {
    (global as any).setSessionId?.(sessionId);
    if (isPersistenceEnabled) {
      await (global as any).syncSessionPersistence?.();
    }
  };

  // 1. Handle --continue
  if (options.continue) {
    try {
      // Zt is loadOrRestoreSession
      const result = await (global as any).loadOrRestoreSession?.(undefined, undefined);
      if (result) {
        if (!options.forkSession && result.sessionId) {
          await setSession(result.sessionId);
        }
        // Restore file history
        if (result.fileHistorySnapshots) {
          (global as any).restoreFileHistory?.(result.fileHistorySnapshots, setAppState);
        }
        return result.messages;
      }
    } catch (err) {
      console.error('Failed to continue session:', err);
      process.exit(1);
    }
  }

  // 2. Handle --teleport
  if (options.teleport) {
    try {
      if (typeof options.teleport !== 'string') throw new Error("No session ID provided for teleport");
      // Yt is resumeTeleportSession
      const sessionData = await (global as any).resumeTeleportSession?.(options.teleport);
      // BEA is checkoutBranch
      const { branchError } = await (global as any).checkoutBranch?.(sessionData.branch);
      // QEA is loadMessagesFromLog
      return (global as any).loadMessagesFromLog?.(sessionData.log, branchError);
    } catch (err) {
      console.error('Failed to teleport session:', err);
      process.exit(1);
    }
  }

  // 3. Handle --resume
  if (options.resume) {
    try {
      const target = parseResumeTarget(typeof options.resume === 'string' ? options.resume : "");
      if (!target) {
        process.stderr.write(`Error: --resume requires a valid session ID, URL, or .jsonl file\n`);
        process.exit(1);
      }

      if (target.isUrl && target.ingressUrl) {
        await (global as any).updateIngressUrl?.(target.sessionId, target.ingressUrl);
      }

      const result = await (global as any).loadOrRestoreSession?.(target.sessionId, target.jsonlFile || undefined);
      if (!result) {
        if (target.isUrl) {
          // Fallback to startup if URL but no local data
          return (global as any).loadStartupMessages?.("startup") || [];
        } else {
          process.stderr.write(`No conversation found with session ID: ${target.sessionId}\n`);
          process.exit(1);
        }
      }

      // Handle --resume-session-at
      if (options.resumeSessionAt) {
        const index = result.messages.findIndex((m: any) => m.uuid === options.resumeSessionAt);
        if (index < 0) {
          process.stderr.write(`No message found with UUID: ${options.resumeSessionAt}\n`);
          process.exit(1);
        }
        result.messages = result.messages.slice(0, index + 1);
      }

      if (!options.forkSession && result.sessionId) {
        await setSession(result.sessionId);
      }

      if (result.fileHistorySnapshots) {
        (global as any).restoreFileHistory?.(result.fileHistorySnapshots, setAppState);
      }
      return result.messages;
    } catch (err) {
      console.error('Failed to resume session:', err);
      process.exit(1);
    }
  }

  // Default: load startup messages
  return (global as any).loadStartupMessages?.("startup") || [];
}

/**
 * Transport factory.
 * Corresponds to obfuscated symbol TR7 in chunks.156.mjs.
 */
export function createIOHandler(input: string | Readable, options: any) {
  let inputStream: Readable;

  if (typeof input === "string") {
    if (input.trim() !== "") {
      // Wrap string input as initial user message JSON-line
      inputStream = Readable.from([JSON.stringify({
        type: "user",
        session_id: "",
        message: {
          role: "user",
          content: input
        },
        parent_tool_use_id: null,
        uuid: crypto.randomUUID()
      }) + "\n"]);
    } else {
      inputStream = Readable.from([]);
    }
  } else {
    inputStream = input;
  }

  if (options.sdkUrl) {
    return new WebSocketSDKTransport({
      url: options.sdkUrl,
      initialInputStream: createAsyncIterableFromStream(inputStream),
      replayUserMessages: options.replayUserMessages,
      sessionId: options.resume && typeof options.resume === 'string' && options.resume.includes('-') ? options.resume : undefined
    });
  } else {
    return new StdioSDKTransport(createAsyncIterableFromStream(inputStream), options.replayUserMessages);
  }
}

/**
 * Helper to convert Readable to AsyncIterable<string>
 */
async function* createAsyncIterableFromStream(stream: Readable): AsyncGenerator<string, void, unknown> {
  for await (const chunk of stream) {
    yield typeof chunk === 'string' ? chunk : chunk.toString('utf8');
  }
}
