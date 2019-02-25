'use strict';
const browser = require('webextension-polyfill');

let userData;
const offlineUser = localStorage.getItem('offline_users');

if (offlineUser) {
  userData = JSON.parse(localStorage.getItem('offline_users-' + offlineUser));
  if (userData && userData.offlineData) {
    browser.extension.sendMessage({
      type: 'userToken',
      apiToken: userData.offlineData.api_token
    });
  }
}

(function () {
  const version = browser.runtime.getManifest().version;
  const source = `window.TogglButton = { version: "${version}" }`;
  const s = document.createElement('script');
  s.textContent = source;
  document.body.appendChild(s);
})();

document.addEventListener('webkitvisibilitychange', function () {
  if (!document.webkitHidden) {
    browser.extension.sendMessage({ type: 'sync' });
  }
});

browser.extension.sendMessage({ type: 'sync' });
