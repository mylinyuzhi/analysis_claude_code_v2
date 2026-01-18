/**
 * @claudecode/integrations - IDE Configuration
 *
 * IDE configuration map and type checking utilities.
 * Reconstructed from chunks.131.mjs:2903-3030
 */

import type { IdeConfig, IdeName, IdeKind } from './types.js';

// ============================================
// IDE Configuration Map
// ============================================

/**
 * IDE configuration map with process detection keywords.
 * Original: iEA (IDE_CONFIG_MAP) in chunks.131.mjs
 */
export const IDE_CONFIG_MAP: Record<IdeName, IdeConfig> = {
  // VSCode-based IDEs
  cursor: {
    ideKind: 'vscode',
    displayName: 'Cursor',
    extension: 'anthropic.claude-code',
    processKeywordsMac: ['Cursor Helper', 'Cursor.app'],
    processKeywordsWindows: ['cursor.exe'],
    processKeywordsLinux: ['cursor'],
  },
  windsurf: {
    ideKind: 'vscode',
    displayName: 'Windsurf',
    extension: 'anthropic.claude-code',
    processKeywordsMac: ['Windsurf Helper', 'Windsurf.app'],
    processKeywordsWindows: ['windsurf.exe'],
    processKeywordsLinux: ['windsurf'],
  },
  vscode: {
    ideKind: 'vscode',
    displayName: 'VS Code',
    extension: 'anthropic.claude-code',
    processKeywordsMac: ['Visual Studio Code', 'Code Helper'],
    processKeywordsWindows: ['code.exe'],
    processKeywordsLinux: ['code'],
  },

  // JetBrains IDEs
  intellij: {
    ideKind: 'jetbrains',
    displayName: 'IntelliJ IDEA',
    extension: 'claude-code-jetbrains-plugin',
    processKeywordsMac: ['IntelliJ IDEA'],
    processKeywordsWindows: ['idea64.exe', 'idea.exe'],
    processKeywordsLinux: ['idea', 'intellij'],
  },
  pycharm: {
    ideKind: 'jetbrains',
    displayName: 'PyCharm',
    extension: 'claude-code-jetbrains-plugin',
    processKeywordsMac: ['PyCharm'],
    processKeywordsWindows: ['pycharm64.exe', 'pycharm.exe'],
    processKeywordsLinux: ['pycharm'],
  },
  webstorm: {
    ideKind: 'jetbrains',
    displayName: 'WebStorm',
    extension: 'claude-code-jetbrains-plugin',
    processKeywordsMac: ['WebStorm'],
    processKeywordsWindows: ['webstorm64.exe', 'webstorm.exe'],
    processKeywordsLinux: ['webstorm'],
  },
  phpstorm: {
    ideKind: 'jetbrains',
    displayName: 'PhpStorm',
    extension: 'claude-code-jetbrains-plugin',
    processKeywordsMac: ['PhpStorm'],
    processKeywordsWindows: ['phpstorm64.exe', 'phpstorm.exe'],
    processKeywordsLinux: ['phpstorm'],
  },
  rubymine: {
    ideKind: 'jetbrains',
    displayName: 'RubyMine',
    extension: 'claude-code-jetbrains-plugin',
    processKeywordsMac: ['RubyMine'],
    processKeywordsWindows: ['rubymine64.exe', 'rubymine.exe'],
    processKeywordsLinux: ['rubymine'],
  },
  clion: {
    ideKind: 'jetbrains',
    displayName: 'CLion',
    extension: 'claude-code-jetbrains-plugin',
    processKeywordsMac: ['CLion'],
    processKeywordsWindows: ['clion64.exe', 'clion.exe'],
    processKeywordsLinux: ['clion'],
  },
  goland: {
    ideKind: 'jetbrains',
    displayName: 'GoLand',
    extension: 'claude-code-jetbrains-plugin',
    processKeywordsMac: ['GoLand'],
    processKeywordsWindows: ['goland64.exe', 'goland.exe'],
    processKeywordsLinux: ['goland'],
  },
  rider: {
    ideKind: 'jetbrains',
    displayName: 'Rider',
    extension: 'claude-code-jetbrains-plugin',
    processKeywordsMac: ['Rider'],
    processKeywordsWindows: ['rider64.exe', 'rider.exe'],
    processKeywordsLinux: ['rider'],
  },
  datagrip: {
    ideKind: 'jetbrains',
    displayName: 'DataGrip',
    extension: 'claude-code-jetbrains-plugin',
    processKeywordsMac: ['DataGrip'],
    processKeywordsWindows: ['datagrip64.exe', 'datagrip.exe'],
    processKeywordsLinux: ['datagrip'],
  },
  appcode: {
    ideKind: 'jetbrains',
    displayName: 'AppCode',
    extension: 'claude-code-jetbrains-plugin',
    processKeywordsMac: ['AppCode'],
    processKeywordsWindows: ['appcode64.exe', 'appcode.exe'],
    processKeywordsLinux: ['appcode'],
  },
  dataspell: {
    ideKind: 'jetbrains',
    displayName: 'DataSpell',
    extension: 'claude-code-jetbrains-plugin',
    processKeywordsMac: ['DataSpell'],
    processKeywordsWindows: ['dataspell64.exe', 'dataspell.exe'],
    processKeywordsLinux: ['dataspell'],
  },
  aqua: {
    ideKind: 'jetbrains',
    displayName: 'Aqua',
    extension: 'claude-code-jetbrains-plugin',
    processKeywordsMac: ['Aqua'],
    processKeywordsWindows: ['aqua64.exe', 'aqua.exe'],
    processKeywordsLinux: ['aqua'],
  },
  gateway: {
    ideKind: 'jetbrains',
    displayName: 'Gateway',
    extension: 'claude-code-jetbrains-plugin',
    processKeywordsMac: ['Gateway'],
    processKeywordsWindows: ['gateway64.exe', 'gateway.exe'],
    processKeywordsLinux: ['gateway'],
  },
  fleet: {
    ideKind: 'jetbrains',
    displayName: 'Fleet',
    extension: 'claude-code-jetbrains-plugin',
    processKeywordsMac: ['Fleet'],
    processKeywordsWindows: ['fleet64.exe', 'fleet.exe'],
    processKeywordsLinux: ['fleet'],
  },
  androidstudio: {
    ideKind: 'jetbrains',
    displayName: 'Android Studio',
    extension: 'claude-code-jetbrains-plugin',
    processKeywordsMac: ['Android Studio'],
    processKeywordsWindows: ['studio64.exe', 'studio.exe'],
    processKeywordsLinux: ['android-studio', 'studio'],
  },
};

// ============================================
// IDE Type Checking
// ============================================

/**
 * Check if IDE is VSCode-based.
 * Original: kF1 (isVSCodeIDE) in chunks.131.mjs:2334-2338
 */
export function isVSCodeIDE(ideName: string | undefined): boolean {
  if (!ideName) return false;
  const config = IDE_CONFIG_MAP[ideName as IdeName];
  return config?.ideKind === 'vscode';
}

/**
 * Check if IDE is JetBrains-based.
 * Original: Rx (isJetBrainsIDE) in chunks.131.mjs:2340-2344
 */
export function isJetBrainsIDE(ideName: string | undefined): boolean {
  if (!ideName) return false;
  const config = IDE_CONFIG_MAP[ideName as IdeName];
  return config?.ideKind === 'jetbrains';
}

/**
 * Get IDE kind.
 */
export function getIdeKind(ideName: string | undefined): IdeKind | undefined {
  if (!ideName) return undefined;
  const config = IDE_CONFIG_MAP[ideName as IdeName];
  return config?.ideKind;
}

/**
 * Get IDE display name.
 * Original: EK (getIDEDisplayName) in chunks.131.mjs:2802-2816
 */
export function getIdeDisplayName(ideName: string | undefined): string {
  if (!ideName) return 'IDE';
  const config = IDE_CONFIG_MAP[ideName as IdeName];
  return config?.displayName ?? ideName;
}

/**
 * Get IDE extension identifier.
 */
export function getIdeExtensionId(ideName: string | undefined): string | undefined {
  if (!ideName) return undefined;
  const config = IDE_CONFIG_MAP[ideName as IdeName];
  return config?.extension;
}

/**
 * Get all supported IDE names.
 */
export function getSupportedIdeNames(): IdeName[] {
  return Object.keys(IDE_CONFIG_MAP) as IdeName[];
}

/**
 * Get IDEs by kind.
 */
export function getIdesByKind(kind: IdeKind): IdeName[] {
  return (Object.entries(IDE_CONFIG_MAP) as [IdeName, IdeConfig][])
    .filter(([_, config]) => config.ideKind === kind)
    .map(([name]) => name);
}

// ============================================
// Export
// ============================================

export {
  IDE_CONFIG_MAP,
  isVSCodeIDE,
  isJetBrainsIDE,
  getIdeKind,
  getIdeDisplayName,
  getIdeExtensionId,
  getSupportedIdeNames,
  getIdesByKind,
};
