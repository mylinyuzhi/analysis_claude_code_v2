/**
 * @claudecode/platform - Network & Proxy Configuration
 *
 * Handles proxy detection, mTLS certificate loading, and undici dispatchers.
 * Reconstructed from chunks.46.mjs.
 */

import * as fs from 'fs';
import { Agent as HttpsAgent } from 'https';
import { ProxyAgent, Agent as UndiciAgent } from 'undici';
import { HttpsProxyAgent } from 'https-proxy-agent';

// ============================================
// mTLS Configuration
// ============================================

/**
 * Get mTLS configuration (certs/keys) from environment.
 * Original: tT in chunks.46.mjs
 */
export function getMtlsConfig(): { cert?: string; key?: string; passphrase?: string } | undefined {
  const config: { cert?: string; key?: string; passphrase?: string } = {};
  
  if (process.env.CLAUDE_CODE_CLIENT_CERT) {
    try {
      config.cert = fs.readFileSync(process.env.CLAUDE_CODE_CLIENT_CERT, 'utf8');
    } catch (error) {
      console.error(`[mTLS] Failed to load client certificate: ${error}`);
    }
  }
  
  if (process.env.CLAUDE_CODE_CLIENT_KEY) {
    try {
      config.key = fs.readFileSync(process.env.CLAUDE_CODE_CLIENT_KEY, 'utf8');
    } catch (error) {
      console.error(`[mTLS] Failed to load client key: ${error}`);
    }
  }
  
  if (process.env.CLAUDE_CODE_CLIENT_KEY_PASSPHRASE) {
    config.passphrase = process.env.CLAUDE_CODE_CLIENT_KEY_PASSPHRASE;
  }
  
  if (Object.keys(config).length === 0) return undefined;
  return config;
}

/**
 * Get mTLS credentials for WebSocket or other clients.
 * Original: Np1 in chunks.46.mjs
 */
export function getMtlsCredentials(): { cert?: string; key?: string; passphrase?: string } | undefined {
  const config = getMtlsConfig();
  if (!config) return undefined;
  return {
    cert: config.cert,
    key: config.key,
    passphrase: config.passphrase
  };
}

// ============================================
// Proxy Configuration
// ============================================

/**
 * Get proxy URL from environment.
 * Original: bn in chunks.46.mjs
 */
export function getProxyUrl(): string | undefined {
  return process.env.https_proxy || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.HTTP_PROXY;
}

/**
 * Check if URL should bypass proxy.
 * Original: leA in chunks.46.mjs
 */
export function shouldBypassProxy(urlStr: string): boolean {
  const noProxy = process.env.no_proxy || process.env.NO_PROXY;
  if (!noProxy) return false;
  if (noProxy === '*') return true;
  
  try {
    const url = new URL(urlStr);
    const hostname = url.hostname.toLowerCase();
    const port = url.port || (url.protocol === 'https:' ? '443' : '80');
    const hostPort = `${hostname}:${port}`;
    
    return noProxy.split(/[,\s]+/).filter(Boolean).some(pattern => {
      const p = pattern.toLowerCase().trim();
      if (p.includes(':')) return hostPort === p;
      if (p.startsWith('.')) return hostname === p.substring(1) || hostname.endsWith(p);
      return hostname === p;
    });
  } catch {
    return false;
  }
}

/**
 * Get user agent string for API requests.
 * Original: VQA in chunks.46.mjs:2015
 */
export function getUserAgent(): string {
  return "claude-code/2.1.7";
}

/**
 * Get proxy agent for a specific URL if applicable.
 * Original: COA in chunks.46.mjs:1257
 */
export function getProxyAgentForUrl(url: string): any {
  const proxyUrl = getProxyUrl();
  if (!proxyUrl || shouldBypassProxy(url)) return undefined;
  return getAxiosProxyAgent(proxyUrl);
}

// ============================================
// Dispatchers & Agents
// ============================================

/**
 * Get undici proxy agent.
 * Original: utQ in chunks.46.mjs
 */
export function getUndiciProxyAgent(proxyUrl: string): ProxyAgent {
  return new ProxyAgent({
    uri: proxyUrl,
    // @ts-ignore
    noProxy: process.env.NO_PROXY || process.env.no_proxy
  } as any);
}

/**
 * Get undici mTLS agent.
 * Original: wp1 in chunks.46.mjs
 */
export function getUndiciMtlsAgent(): UndiciAgent {
  const mtls = getMtlsConfig();
  return new UndiciAgent({
    connect: {
      cert: mtls?.cert,
      key: mtls?.key,
      passphrase: mtls?.passphrase,
      // @ts-ignore
      pipelining: 1
    } as any
  });
}

/**
 * Get the global undici dispatcher (proxy or mTLS).
 * Original: pJA in chunks.46.mjs
 */
export function getGlobalDispatcher(): any {
  const proxyUrl = getProxyUrl();
  if (proxyUrl) {
    return getUndiciProxyAgent(proxyUrl);
  }
  
  const mtls = getMtlsConfig();
  if (mtls) {
    return getUndiciMtlsAgent();
  }
  
  return undefined;
}

/**
 * Get HTTPS agent with mTLS support.
 * Original: ktQ in chunks.46.mjs
 */
export function getHttpsAgentWithMtls(): HttpsAgent | undefined {
  const mtls = getMtlsConfig();
  if (!mtls) return undefined;
  return new HttpsAgent({
    ...mtls,
    keepAlive: true
  });
}

/**
 * Get Axios-compatible proxy agent.
 * Original: gtQ in chunks.46.mjs
 */
export function getAxiosProxyAgent(proxyUrl: string): any {
  const mtls = getMtlsConfig();
  return new HttpsProxyAgent(proxyUrl, {
    ...(mtls && {
      cert: mtls.cert,
      key: mtls.key,
      passphrase: mtls.passphrase
    })
  });
}
