'use strict';

var userData, offlineUser;
offlineUser = localStorage.getItem('offline_users');

if (offlineUser) {
  userData = JSON.parse(localStorage.getItem('offline_users-' + offlineUser));
  if (userData && userData.offlineData) {
    chrome.extension.sendMessage({
      type: 'userToken',
      apiToken: userData.offlineData.api_token
    });
  }
}

(function() {
  var source, s;
  const version = chrome.runtime.getManifest().version;
  source = `window.TogglButton = { version: "${version}" }`;
  s = document.createElement('script');
  s.textContent = source;
  document.body.appendChild(s);
})();

document.addEventListener('webkitvisibilitychange', function() {
  if (!document.webkitHidden) {
    chrome.extension.sendMessage({ type: 'sync' }, function() {
      return;
    });
  }
});

chrome.extension.sendMessage({ type: 'sync' }, function() {
  return;
});
