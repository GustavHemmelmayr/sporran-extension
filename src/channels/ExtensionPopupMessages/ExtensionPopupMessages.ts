import { disconnect, connect } from '@kiltprotocol/core';
import { browser, Runtime } from 'webextension-polyfill-ts';

const name = 'popup';

export function connectToBackground(): void {
  browser.runtime.connect({ name });
}

export function onPopupConnect(callback: (port: Runtime.Port) => void): void {
  browser.runtime.onConnect.addListener((port) => {
    if (port.name === name) {
      callback(port);
    }
  });
}

const timeoutMs = 3000;

let timeoutId: NodeJS.Timeout;

export async function connectToBlockchain(port: Runtime.Port): Promise<void> {
  port.onDisconnect.addListener(() => {
    timeoutId = setTimeout(disconnect, timeoutMs);
  });
  clearTimeout(timeoutId);
  await connect();
}
