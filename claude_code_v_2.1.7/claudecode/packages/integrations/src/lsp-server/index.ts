/**
 * @claudecode/integrations - LSP Server
 *
 * This module provides integration with Language Server Protocol (LSP) servers.
 * It handles the lifecycle of LSP servers, routing requests to the appropriate server
 * based on file extension, and formatting results for the LLM.
 */

import { lspServerManager } from './manager';
import { mapToLspRequest } from './operations';
import type { LspOperation } from './types';

export * from './types';
export * from './client';
export * from './instance';
export * from './manager';
export * from './operations';

// Wrapper functions for API surface
export const getLspManager = () => lspServerManager;
export const initializeLspServerManager = () => lspServerManager.initialize();
export const shutdownLspServerManager = () => lspServerManager.shutdown();
export const getLspManagerStatus = () => lspServerManager.getStatus();
export const waitForLspManagerInit = () => lspServerManager.waitForInit();

// Aliases
export const buildLspRequest = mapToLspRequest;

// Constants
export const LSP_OPERATIONS: LspOperation[] = [
  'goToDefinition',
  'findReferences',
  'hover',
  'documentSymbol',
  'workspaceSymbol',
  'goToImplementation',
  'prepareCallHierarchy',
  'incomingCalls',
  'outgoingCalls'
];
