#!/usr/bin/env node
/**
 * @claudecode/cli - Binary Entry Point
 *
 * Main executable for the Claude Code CLI.
 */

import { mainEntry } from './commands/entry.js';

// Run main entry
mainEntry().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
