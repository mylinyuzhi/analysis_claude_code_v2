/**
 * @claudecode/platform - Browser Utilities
 */

import { spawn } from 'node:child_process';

/**
 * Open a URL in the default browser.
 * Original: i7 in chunks.89.mjs
 */
export async function openBrowser(url: string): Promise<boolean> {
  try {
    const browserEnv = process.env.BROWSER;
    const platform = process.platform;

    if (platform === 'win32') {
      if (browserEnv) {
        return new Promise((resolve) => {
          const child = spawn(browserEnv, [`"${url}"`], { shell: true });
          child.on('exit', (code) => resolve(code === 0));
          child.on('error', () => resolve(false));
        });
      }
      return new Promise((resolve) => {
        const child = spawn('rundll32', ['url,OpenURL', url]);
        child.on('exit', (code) => resolve(code === 0));
        child.on('error', () => resolve(false));
      });
    } else {
      const command = browserEnv || (platform === 'darwin' ? 'open' : 'xdg-open');
      return new Promise((resolve) => {
        const child = spawn(command, [url]);
        child.on('exit', (code) => resolve(code === 0));
        child.on('error', () => resolve(false));
      });
    }
  } catch {
    return false;
  }
}
