/*jslint indent: 2 */
/*global window: false, XMLHttpRequest: false, chrome: false, btoa: false */
"use strict";

var TogglButton = {
  $user: null,
  $apiUrl: "https://www.toggl.com/api",

  checkUrl: function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      if (/toggl\.com\/track/.test(tab.url)) {
        TogglButton.fetchUser("/v7");
      } else if (/toggl\.com\/app/.test(tab.url)) {
        TogglButton.fetchUser("/v8");
      }
    }
  },

  fetchUser: function (apiVersion) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", TogglButton.$apiUrl + apiVersion + "/me?with_related_data=true", true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var resp = JSON.parse(xhr.responseText);
        TogglButton.$user = resp.data;
      } else if (apiVersion === "/v7") {
        TogglButton.fetchUser("/v8");
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
          wid: TogglButton.$user.default_wid,
          pid: timeEntry.projectId || null,
          billable: timeEntry.billable || false,
          duration: -(start.getTime() / 1000)
        }
      };
    xhr.open("POST", TogglButton.$apiUrl + "/v8/time_entries", true);
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(TogglButton.$user.api_token + ':api_token'));
    xhr.send(JSON.stringify(entry));
  },

  newMessage: function (request, sender, sendResponse) {
    var imagePath = 'images/inactive-19.png';
    if (request.type === 'activate') {
      if (TogglButton.$user !== null) {
        imagePath = 'images/active-19.png';
      }
      chrome.pageAction.setIcon({
        path: imagePath,
        tabId: sender.tab.id
      });
      chrome.pageAction.show(sender.tab.id);
      sendResponse({success: TogglButton.$user !== null, user: TogglButton.$user});
    } else if (request.type === 'timeEntry') {
      TogglButton.createTimeEntry(request);
    }
  }

};

chrome.pageAction.onClicked.addListener(function (tab) {
  if (TogglButton.$user === null) {
    chrome.tabs.create({url: 'https://new.toggl.com/#login'});
  }
});

TogglButton.fetchUser("/v7");
chrome.tabs.onUpdated.addListener(TogglButton.checkUrl);
chrome.extension.onMessage.addListener(TogglButton.newMessage);
