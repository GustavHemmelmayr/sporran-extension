// src/__mocks__/webextension-polyfill-ts
// Update this file to include any mocks for the `webextension-polyfill-ts` package
// This is used to mock these values for Storybook so you can develop your components
// outside the Web Extension environment provided by a compatible browser

import messagesEN from '../static/_locales/en/messages.json';

export const browser = {
  tabs: {
    executeScript(
      currentTabId: number /* eslint-disable-line @typescript-eslint/no-unused-vars */,
      details: unknown /* eslint-disable-line @typescript-eslint/no-unused-vars */,
    ): Promise<{ done: boolean }> {
      return Promise.resolve({ done: true });
    },
  },
  i18n: {
    getMessage(
      messageName: keyof typeof messagesEN,
      // substitutions?: any,
    ): string {
      const messageData = messagesEN[messageName];
      return messageData ? messageData.message : `[[${messageName}]]`;
    },
  },
  storage: {
    local: {
      async set(): Promise<void> {
        // dummy
      },
    },
  },
  runtime: {
    sendMessage(): void {
      // dummy
    },
  },
};

export interface Tabs {
  Tab: {
    id: number;
  };
}
