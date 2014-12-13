/*jslint indent: 2 */
/*global document: false, $: false, localStorage: false, chrome:false*/

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

document.addEventListener('webkitvisibilitychange', function () {
  if (!document.webkitHidden) {
    chrome.extension.sendMessage({type: "sync"}, function () {return; });
  }
});

chrome.extension.sendMessage({type: "sync"}, function () {return; });
