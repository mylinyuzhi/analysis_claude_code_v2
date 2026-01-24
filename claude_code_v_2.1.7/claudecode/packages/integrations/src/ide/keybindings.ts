/**
 * @claudecode/integrations - Terminal Keybinding Setup
 *
 * Configures Shift+Enter for multi-line input in various terminals.
 * Reconstructed from chunks.68.mjs
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import crypto from 'crypto';
import { getOS, isInCodeTerminal } from './detection.js';

const execAsync = promisify(exec);

// ============================================
// Types & Constants
// ============================================

type TerminalName = 
  | 'Apple_Terminal'
  | 'vscode'
  | 'cursor'
  | 'windsurf'
  | 'alacritty'
  | 'WarpTerminal'
  | 'zed'
  | string;

// ============================================
// Main Entry Points
// ============================================

/**
 * Check if the current terminal supports keybinding setup.
 * Original: EjA (supportsKeybindingSetup) in chunks.68.mjs
 */
export function supportsKeybindingSetup(): boolean {
  const term = getTerminalName();
  const platform = getOS();

  return (
    (platform === 'macos' && term === 'Apple_Terminal') ||
    term === 'vscode' ||
    term === 'cursor' ||
    term === 'windsurf' ||
    term === 'alacritty' ||
    term === 'WarpTerminal' ||
    term === 'zed'
  );
}

/**
 * Setup Shift+Enter keybinding for the current terminal.
 * Original: uB0 (setupTerminalKeybinding) in chunks.68.mjs
 */
export async function setupTerminalKeybinding(): Promise<string> {
  const term = getTerminalName();
  let message = '';

  switch (term) {
    case 'Apple_Terminal':
      message = await setupAppleTerminal();
      break;
    case 'vscode':
      message = installVSCodeKeybinding('VSCode');
      break;
    case 'cursor':
      message = installVSCodeKeybinding('Cursor');
      break;
    case 'windsurf':
      message = installVSCodeKeybinding('Windsurf');
      break;
    case 'alacritty':
      message = await setupAlacritty();
      break;
    case 'WarpTerminal':
      message = setupWarp();
      break;
    case 'zed':
      message = setupZed();
      break;
    default:
      message = 'Unsupported terminal for automatic keybinding setup.';
      break;
  }

  // TODO: Update state tracking (e.g. shiftEnterKeyBindingInstalled = true)
  return message;
}

// ============================================
// Terminal Detection
// ============================================

/**
 * Get current terminal name.
 * Derived from l0.terminal logic.
 */
export function getTerminalName(): TerminalName | null {
  const program = process.env.TERM_PROGRAM;
  
  if (program) {
    if (program === 'Apple_Terminal') return 'Apple_Terminal';
    if (program === 'vscode') return 'vscode';
    if (program === 'cursor') return 'cursor';
    if (program === 'WarpTerminal') return 'WarpTerminal';
  }

  // Check for others via specific env vars or inference
  if (process.env.ALACRITTY_LOG || process.env.TERM === 'alacritty') return 'alacritty';
  if (process.env.ZED_TERM) return 'zed';
  
  // VS Code / Cursor / Windsurf might set specific vars
  if (process.env.VSCODE_INJECTION) return 'vscode'; // simplified

  // Check Windsurf specific
  // Assuming windsurf sets TERM_PROGRAM='windsurf' or similar
  if (program === 'windsurf') return 'windsurf';

  return program || null;
}

// ============================================
// VS Code / Cursor / Windsurf
// ============================================

/**
 * Install Shift+Enter keybinding for VSCode-based IDEs.
 * Original: fB0 (installVSCodeKeybinding) in chunks.68.mjs
 */
function installVSCodeKeybinding(ideName: string): string {
  // Determine config directory based on IDE and platform
  const configDirName = ideName === 'VSCode' ? 'Code' : ideName;
  const platform = getOS();
  
  let userDir: string;
  if (platform === 'windows') {
    userDir = path.join(process.env.APPDATA || '', configDirName, 'User');
  } else if (platform === 'macos') {
    userDir = path.join(os.homedir(), 'Library', 'Application Support', configDirName, 'User');
  } else {
    // Linux
    userDir = path.join(os.homedir(), '.config', configDirName, 'User');
  }

  const keybindingsPath = path.join(userDir, 'keybindings.json');
  
  try {
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    let keybindings: any[] = [];
    let content = '[]';

    if (fs.existsSync(keybindingsPath)) {
      content = fs.readFileSync(keybindingsPath, 'utf-8');
      // Parse JSON allowing comments (simple strip for now or standard parse)
      // VS Code allows comments in JSON, so standard JSON.parse might fail.
      // We'll try standard parse first, if fail, we might need a comment stripper.
      // For restoration, we'll assume valid JSON or standard comment stripping if needed.
      try {
        keybindings = JSON.parse(content);
      } catch {
        // Simple fallback: try to strip comments (// ...)
        const stripped = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
        try {
            keybindings = JSON.parse(stripped);
        } catch {
            keybindings = []; // Start fresh if corrupt
        }
      }

      // Backup
      const backupPath = `${keybindingsPath}.${crypto.randomBytes(4).toString('hex')}.bak`;
      fs.copyFileSync(keybindingsPath, backupPath);
    }

    // Check existing
    const exists = keybindings.find(k => 
      k.key === 'shift+enter' && 
      k.command === 'workbench.action.terminal.sendSequence' &&
      k.when === 'terminalFocus'
    );

    if (exists) {
      return `Found existing ${ideName} terminal Shift+Enter key binding. Remove it to continue.`;
    }

    // Add new binding
    keybindings.push({
      key: "shift+enter",
      command: "workbench.action.terminal.sendSequence",
      args: { text: "\u001b\r" }, // ESC + CR
      when: "terminalFocus"
    });

    fs.writeFileSync(keybindingsPath, JSON.stringify(keybindings, null, 2), 'utf-8');
    return `Installed ${ideName} terminal Shift+Enter key binding`;
  } catch (error) {
    throw new Error(`Failed to install ${ideName} terminal Shift+Enter key binding: ${error}`);
  }
}

// ============================================
// Apple Terminal
// ============================================

/**
 * Setup Apple Terminal preferences (Option as Meta, Visual Bell).
 * Original: gE8 (setupAppleTerminal)
 */
async function setupAppleTerminal(): Promise<string> {
  try {
    // 1. Check/Backup
    // simplified for restoration
    
    // 2. Read Default Window Settings profile name
    const { stdout: defaultProfile } = await execAsync('defaults read com.apple.Terminal "Default Window Settings"');
    const profileName = defaultProfile.trim();
    if (!profileName) throw new Error("Failed to read default Terminal.app profile");

    // 3. Configure Option as Meta Key
    // defaults write com.apple.Terminal "Window Settings" -dict-add <Profile> "useOptionAsMetaKey" -bool true
    await execAsync(`defaults write com.apple.Terminal "Window Settings" -dict-add "${profileName}" "useOptionAsMetaKey" -bool true`);

    // 4. Configure Visual Bell (disable audio bell)
    // defaults write com.apple.Terminal "Window Settings" -dict-add <Profile> "Bell" -bool false
    await execAsync(`defaults write com.apple.Terminal "Window Settings" -dict-add "${profileName}" "Bell" -bool false`);
    await execAsync(`defaults write com.apple.Terminal "Window Settings" -dict-add "${profileName}" "VisualBell" -bool true`);

    return `Configured Terminal.app settings:\n- Enabled "Use Option as Meta key"\n- Switched to visual bell\nOption+Enter will now enter a newline.\nYou must restart Terminal.app for changes to take effect.`;
  } catch (error) {
    throw new Error(`Failed to configure Apple Terminal: ${error}`);
  }
}

// ============================================
// Alacritty
// ============================================

/**
 * Setup Alacritty TOML config.
 * Original: uE8 (setupAlacritty)
 */
async function setupAlacritty(): Promise<string> {
  // Find config path
  const paths = [];
  if (process.env.XDG_CONFIG_HOME) {
    paths.push(path.join(process.env.XDG_CONFIG_HOME, 'alacritty', 'alacritty.toml'));
  }
  paths.push(path.join(os.homedir(), '.config', 'alacritty', 'alacritty.toml'));
  
  if (getOS() === 'windows' && process.env.APPDATA) {
    paths.push(path.join(process.env.APPDATA, 'alacritty', 'alacritty.toml'));
  }

  let configPath = paths.find(p => fs.existsSync(p));
  
  // If not exists, create at first preferred location
  if (!configPath) {
    if (paths.length === 0) throw new Error("Could not determine Alacritty config path");
    configPath = paths[0];
    if (!configPath) throw new Error("Invalid config path"); // Should not happen
    
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(configPath, '', 'utf-8'); // Create empty file
  }

  try {
    let content = fs.readFileSync(configPath, 'utf-8');
    
    // Check existing
    if (content.includes('mods = "Shift"') && content.includes('key = "Return"')) {
      return `Found existing Alacritty Shift+Enter key binding in ${configPath}. Remove it to continue.`;
    }

    // Backup
    const backupPath = `${configPath}.${crypto.randomBytes(4).toString('hex')}.bak`;
    fs.copyFileSync(configPath, backupPath);

    // Append config
    // Alacritty TOML format
    const newConfig = `
[[keyboard.bindings]]
key = "Return"
mods = "Shift"
chars = "\\x1b\\r"
`;
    
    if (content && !content.endsWith('\n')) content += '\n';
    fs.writeFileSync(configPath, content + newConfig, 'utf-8');

    return `Installed Alacritty Shift+Enter key binding in ${configPath}\nYou may need to restart Alacritty for changes to take effect`;
  } catch (error) {
    throw new Error(`Failed to install Alacritty key binding: ${error}`);
  }
}

// ============================================
// Warp
// ============================================

/**
 * Setup instructions for Warp.
 * Original: mE8 (setupWarp)
 */
function setupWarp(): string {
  if (getOS() === 'macos') {
    return `Warp requires manual configuration:
For Alt+T (thinking) and Alt+P (model picker):
  Settings → Features → Enable "Left Option key is meta"

Note: Warp does not support custom Shift+Enter keybindings.
Use backslash (\\) + Enter for multi-line input.`;
  }
  return `Warp does not support custom Shift+Enter keybindings.
Use backslash (\\) + Enter for multi-line input.`;
}

// ============================================
// Zed
// ============================================

/**
 * Setup instructions for Zed.
 * Original: dE8 (setupZed)
 */
function setupZed(): string {
  // Based on the pattern, Zed might support it or need manual config.
  // The original function dE8 is not fully visible in snippet, but likely prints instructions or modifies keymap.json
  // Assuming manual instructions for now as safe default if I don't have the exact code.
  // Wait, line 2438: Q = dE8(A).
  // I don't have dE8 implementation in the snippet.
  // I'll provide a helpful message.
  return `Zed keybinding setup:
Open your keymap (Cmd+K Cmd+S) and add:
{
  "context": "Terminal",
  "bindings": {
    "shift-enter": ["terminal::SendText", "\\u001b\\r"]
  }
}`;
}
