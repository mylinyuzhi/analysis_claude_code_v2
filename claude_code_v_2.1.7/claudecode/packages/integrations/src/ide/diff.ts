/**
 * @claudecode/integrations - IDE Diff Support
 *
 * React hook and utilities for opening diffs in the connected IDE via MCP.
 * Reconstructed from chunks.149.mjs
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import path from 'path';
import fs from 'fs';
import { randomBytes } from 'crypto';

import { hasConnectedIDE, getIDEName, getIDEClient } from './connection.js';
import type { IdeName } from './types.js';
import type { ToolUseContext } from '../mcp/types.js'; // Assuming type exists

// ============================================
// Types
// ============================================

interface Edit {
  old_string?: string;
  new_string?: string;
  // ... other edit fields
}

interface UseDiffWithIDEResult {
  closeTabInIDE: () => Promise<void>;
  showingDiffInIDE: boolean;
  ideName: string;
  hasError: boolean;
}

interface UseDiffWithIDEProps {
  onChange: (type: { type: 'accept-once' | 'reject' }, data: { file_path: string; edits: Edit[] }) => void;
  toolUseContext: any; // specific context type
  filePath: string;
  edits: Edit[];
  editMode: 'single' | 'multiple';
}

// ============================================
// Hook
// ============================================

/**
 * React hook for IDE diff display.
 * Original: tI9 (useDiffWithIDE) in chunks.149.mjs:3253-3313
 */
export function useDiffWithIDE({
  onChange,
  toolUseContext,
  filePath,
  edits,
  editMode
}: UseDiffWithIDEProps): UseDiffWithIDEResult {
  const isCancelled = useRef(false);
  const [hasError, setHasError] = useState(false);
  
  // Random 6-char ID for the tab name
  const randomId = useMemo(() => randomBytes(3).toString('hex'), []);
  const tabName = useMemo(() => `✻ [Claude Code] ${path.basename(filePath)} (${randomId}) ⧉`, [filePath, randomId]);

  // Check if IDE diff is available
  // Original: W = fF1(...) && L1().diffTool === "auto" && !B.endsWith(".ipynb")
  // We assume L1() gets settings. For now we access process.env or similar if settings not available.
  const mcpClients = toolUseContext.options?.mcpClients;
  const ideConnected = hasConnectedIDE(mcpClients);
  
  // TODO: Get real settings
  const diffToolSetting = 'auto'; // getSettings().diffTool
  const canShowDiff = ideConnected && diffToolSetting === 'auto' && !filePath.endsWith('.ipynb');

  const ideName = getIDEName(mcpClients) ?? "IDE";

  async function showDiff() {
    if (!canShowDiff) return;
    
    try {
      // telemetry("tengu_ext_will_show_diff", {});
      console.log('tengu_ext_will_show_diff');
      
      const { oldContent, newContent } = await openDiffInIDE(filePath, edits, toolUseContext, tabName);
      
      if (isCancelled.current) return;

      // telemetry("tengu_ext_diff_accepted", {});
      console.log('tengu_ext_diff_accepted');
      
      const processedEdits = processEdits(filePath, oldContent, newContent, editMode);

      if (processedEdits.length === 0) {
        // User rejected the diff (closed tab without saving, or rejected explicit)
        // telemetry("tengu_ext_diff_rejected", {});
        console.log('tengu_ext_diff_rejected');
        
        const ideClient = getIDEClient(mcpClients);
        if (ideClient) {
          await closeTab(tabName, ideClient);
        }
        
        onChange({ type: 'reject' }, { file_path: filePath, edits });
        return;
      }

      onChange({ type: 'accept-once' }, { file_path: filePath, edits: processedEdits });
    } catch (error) {
      console.error(error);
      setHasError(true);
    }
  }

  useEffect(() => {
    showDiff();
    return () => {
      isCancelled.current = true;
    };
  }, []);

  return {
    closeTabInIDE: async () => {
      const ideClient = getIDEClient(mcpClients);
      if (!ideClient) return;
      return closeTab(tabName, ideClient);
    },
    showingDiffInIDE: canShowDiff && !hasError,
    ideName,
    hasError
  };
}

// ============================================
// Logic
// ============================================

/**
 * Process edits after diff.
 * Original: Nq7
 */
function processEdits(filePath: string, oldContent: string, newContent: string, editMode: string): Edit[] {
  // TODO: Implement diff processing logic (WS2, ES2)
  // For now, return edits as is if content changed, or empty if rejected/no change
  if (oldContent === newContent) return [];
  
  // This is a placeholder. Real logic needs to compute hunks.
  // We'll return a single replacement edit for now to satisfy the type.
  return [{
    old_string: oldContent,
    new_string: newContent
  }];
}

/**
 * Open diff tab in IDE.
 * Original: wq7
 */
async function openDiffInIDE(
  filePath: string,
  edits: Edit[],
  toolUseContext: any,
  tabName: string
): Promise<{ oldContent: string; newContent: string }> {
  const mcpClients = toolUseContext.options?.mcpClients;
  const ideClient = getIDEClient(mcpClients);
  if (!ideClient) throw new Error("No IDE client connected");

  // Read current file content
  let oldContent = "";
  if (fs.existsSync(filePath)) {
    oldContent = fs.readFileSync(filePath, 'utf-8');
  }

  // Apply edits to get new content
  // TODO: Use real applyEdits (QbA)
  let newContent = oldContent; // Placeholder
  // Logic to apply edits...

  // Call MCP openDiff
  // We need to implement mcpCall or use client.request
  /*
  const result = await ideClient.request({
    method: "openDiff",
    params: {
      old_file_path: filePath,
      new_file_path: filePath,
      new_file_contents: newContent,
      tab_name: tabName
    }
  });
  */
 
  // Placeholder return
  return { oldContent, newContent };
}

/**
 * Close tab in IDE.
 * Original: VS0
 */
async function closeTab(tabName: string, client: any): Promise<void> {
  /*
  await client.request({
    method: "close_tab",
    params: { tab_name: tabName }
  });
  */
}

export async function closeAllDiffTabs(client: any): Promise<void> {
  /*
  await client.request({
    method: "closeAllDiffTabs",
    params: {}
  });
  */
}
