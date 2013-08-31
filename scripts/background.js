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
    xhr.open("GET", TogglButton.$apiUrl + "/v7/me.json?with_related_data=true", true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var resp = JSON.parse(xhr.responseText);
        TogglButton.$user = resp.data;

        // Compute client, project, and task lookups.
        var clientMap = {};
        resp.data.clients.forEach(function (client) { clientMap[client.id] = client; });
        TogglButton.$user.$clientMap = clientMap;

        var projectMap = {};
        resp.data.projects.forEach(function (project) { projectMap[project.id] = project; });
        TogglButton.$user.$projectMap = projectMap;

        // Compute a task-name map for each project.
        resp.data.tasks.forEach(function (task) {
          var project = projectMap[task.pid];
          if (!project) { return; }

          if (!project.$taskNameMap) { project.$taskNameMap = {}; }
          project.$taskNameMap[task.name] = task;
        });
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
          tid: timeEntry.taskId || null,
          billable: timeEntry.billable || false,
          duration: -(start.getTime() / 1000)
        }
      };
    xhr.open("POST", TogglButton.$apiUrl + "/v8/time_entries", true);
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(TogglButton.$user.api_token + ':api_token'));
    xhr.send(JSON.stringify(entry));
  },

  newMessage: function (request, sender, sendResponse) {
    if (request.type === 'activate') {
      if (TogglButton.$user !== null) {
        chrome.pageAction.show(sender.tab.id);
      }
      sendResponse({success: TogglButton.$user !== null, user: TogglButton.$user});
    } else if (request.type === 'timeEntry') {
      TogglButton.createTimeEntry(request);
    }
  }

};

TogglButton.fetchUser();
chrome.tabs.onUpdated.addListener(TogglButton.checkUrl);
chrome.extension.onMessage.addListener(TogglButton.newMessage);
