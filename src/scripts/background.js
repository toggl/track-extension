/*jslint indent: 2, unparam: true*/
/*global window: false, XMLHttpRequest: false, chrome: false, btoa: false */
"use strict";

var TogglButton = {
  $user: null,
  $curEntryId: null,
  $apiUrl: "https://old.toggl.com/api/v7",
  $newApiUrl: "https://www.toggl.com/api/v8",
  $sites: new RegExp(
    [
      'asana\\.com',
      'podio\\.com',
      'trello\\.com',
      'github\\.com',
      'bitbucket\\.org',
      'gitlab\\.com',
      'redbooth\\.com',
      'teamweek\\.com',
      'basecamp\\.com',
      'unfuddle\\.com',
      'worksection\\.com',
      'pivotaltracker\\.com',
      'producteev\\.com',
      'sifterapp\\.com',
      'docs\\.google\\.com',
      'drive\\.google\\.com',
      'redmine\\.org',
      'myjetbrains\\.com',
      'capsulecrm\\.com',
      'zendesk\\.com'
    ].join('|')
  ),

  checkUrl: function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      if (TogglButton.$sites.test(tab.url)) {
        TogglButton.setPageAction(tabId);
      } else if (/toggl\.com\/track/.test(tab.url)) {
        TogglButton.fetchUser(TogglButton.$apiUrl);
      } else if (/toggl\.com\/app.*/.test(tab.url)) {
        TogglButton.fetchUser(TogglButton.$newApiUrl);
      }
    }
  },

  fetchUser: function (apiUrl) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl + "/me?with_related_data=true", true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var projectMap = {}, resp = JSON.parse(xhr.responseText);
        if (resp.data.projects) {
          resp.data.projects.forEach(function (project) {
            projectMap[project.name] = project.id;
          });
        }
        TogglButton.$user = resp.data;
        TogglButton.$user.projectMap = projectMap;
      } else if (apiUrl === TogglButton.$apiUrl) {
        TogglButton.fetchUser(TogglButton.$newApiUrl);
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
          description: timeEntry.description,
          wid: TogglButton.$user.default_wid,
          pid: timeEntry.projectId || null,
          billable: timeEntry.billable || false,
          duration: -(start.getTime() / 1000),
          created_with: timeEntry.createdWith || 'TogglButton'
        }
      };
    if (timeEntry.projectName !== undefined) {
      entry.time_entry.pid = TogglButton.$user.projectMap[timeEntry.projectName];
    }
    xhr.open("POST", TogglButton.$newApiUrl + "/time_entries", true);
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(TogglButton.$user.api_token + ':api_token'));
    // handle response
    xhr.addEventListener('load', function (e) {
      var responseData, entryId;
      responseData = JSON.parse(xhr.responseText);
      entryId = responseData && responseData.data && responseData.data.id;
      TogglButton.$curEntryId = entryId;
    });
    xhr.send(JSON.stringify(entry));
  },

  stopTimeEntry: function (entryId) {
    entryId = entryId || TogglButton.$curEntryId;
    if (!entryId) {
      return;
    }
    var xhr = new XMLHttpRequest();

    // PUT https://www.toggl.com/api/v8/time_entries/{time_entry_id}/stop
    xhr.open("PUT", TogglButton.$newApiUrl + "/time_entries/" + entryId + "/stop", true);
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(TogglButton.$user.api_token + ':api_token'));
    xhr.send();
  },

  setPageAction: function (tabId) {
    var imagePath = 'images/inactive-19.png';
    if (TogglButton.$user !== null) {
      imagePath = 'images/active-19.png';
    }
    chrome.pageAction.setIcon({
      tabId: tabId,
      path: imagePath
    });
    chrome.pageAction.show(tabId);
  },

  newMessage: function (request, sender, sendResponse) {
    if (request.type === 'activate') {
      TogglButton.setPageAction(sender.tab.id);
      sendResponse({success: TogglButton.$user !== null, user: TogglButton.$user});
    } else if (request.type === 'timeEntry') {
      TogglButton.createTimeEntry(request);
    } else if (request.type === 'stop') {
      TogglButton.stopTimeEntry();
    }
  }

};

chrome.pageAction.onClicked.addListener(function (tab) {
  if (TogglButton.$user === null) {
    chrome.tabs.create({url: 'https://www.toggl.com/#login'});
  }
});

TogglButton.fetchUser(TogglButton.$apiUrl);
chrome.tabs.onUpdated.addListener(TogglButton.checkUrl);
chrome.extension.onMessage.addListener(TogglButton.newMessage);
