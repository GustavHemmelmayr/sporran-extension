import { render } from 'react-dom';
import { browser } from 'webextension-polyfill-ts';

import { AppWithProviders } from './views/App/App';
import { connectToBackground } from './channels/ExtensionPopupMessages/ExtensionPopupMessages';
import { chromeMacBug } from './components/chromeMacBug/chromeMacBug';
import { resizePopup } from './channels/base/PopupChannel/PopupMessages';

import { initKiltSDK } from './utilities/initKiltSDK/initKiltSDK';

(async () => {
  await resizePopup();

  await browser.tabs.query({ active: true, currentWindow: true });
  connectToBackground();

  await initKiltSDK();

  await chromeMacBug();
  document.documentElement.lang = browser.i18n.getUILanguage();

  render(<AppWithProviders />, document.getElementById('popup'));
})();
