/*jslint indent: 2 */
/*global window: false, XMLHttpRequest: false, chrome: false, btoa: false */
"use strict";

var TogglButton = {
  $user: null,
  $apiUrl: "https://www.toggl.com/api",

  checkUrl: function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      if (/toggl\.com\/track/.test(tab.url)) {
        TogglButton.fetchUser();
      }
    }
  },

  fetchUser: function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", TogglButton.$apiUrl + "/v7/me.json", true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var resp = JSON.parse(xhr.responseText);
        TogglButton.$user = resp.data;
      }
    };
    xhr.send();
  },

  createTimeEntry: function (timeEntry) {
    var start = new Date(),
      xhr = new XMLHttpRequest(),
      entry = {
        time_entry: {
          start: start.toISOString(),
          created_with: "Toggl Button",
          description: timeEntry.description,
          pid: timeEntry.pid,
          duration: -(start.getTime() / 1000)
        }
      };
    if (entry.pid === undefined) {
      entry.wid = TogglButton.$user.default_wid;
    }

    xhr.open("POST", TogglButton.$apiUrl + "/v8/time_entries", true);
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(TogglButton.$user.api_token + ':api_token'));
    xhr.send(JSON.stringify(entry));
  },

  newMessage: function (request, sender, sendResponse) {
    switch (request.type) {
    case 'activate':
      if (TogglButton.$user !== null) {
        chrome.pageAction.show(sender.tab.id);
      }
      sendResponse({success: TogglButton.$user !== null});
      break;

    case 'timeEntry':
      TogglButton.createTimeEntry(request);
      break;

    default:
      console.warn("Recieved message of unknown type. Request:", request);
    }
  }

};

TogglButton.fetchUser();
chrome.tabs.onUpdated.addListener(TogglButton.checkUrl);
chrome.extension.onMessage.addListener(TogglButton.newMessage);
