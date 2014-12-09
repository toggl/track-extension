/*jslint indent: 2, unparam: true*/
/*global window: false, XMLHttpRequest: false, WebSocket: false, chrome: false, btoa: false, localStorage:false */
"use strict";

var TogglButton = {
  $user: null,
  $curEntry: null,
  $showPostPopup: true,
  $ApiV8Url: "https://www.toggl.com/api/v8",
  $sendResponse: null,
  $socket: null,
  $retrySocket: false,
  $socketEnabled: false,
  $timer: null,
  $idleCheckEnabled: false,
  $idleInterval: 360000,
  $idleFromTo: "09:00-17:00",
  $lastSyncDate: null,
  $version: ("TogglButton/" + chrome.runtime.getManifest().version),
  $editForm: '<div id="toggl-button-edit-form">' +
      '<form>' +
      '<a class="toggl-button {service} active" href="#">Stop timer</a>' +
      '<a id="toggl-button-hide">x</a>' +
      '<div class="toggl-button-row">' +
        '<input name="toggl-button-description" type="text" id="toggl-button-description" class="toggl-button-input" value="">' +
      '</div>' +
      '<div class="toggl-button-row">' +
        '<select class="toggl-button-input" id="toggl-button-project" name="toggl-button-project">{projects}</select>' +
        '<div id="toggl-button-project-placeholder" class="toggl-button-input" disabled><div class="toggl-button-text">Add project</div><span>▼</span></div>' +
      '</div>' +
      '<div class="toggl-button-row">' +
        '<select class="toggl-button-input" id="toggl-button-tag" name="toggl-button-tag" multiple>{tags}</select>' +
        '<div id="toggl-button-tag-placeholder" class="toggl-button-input" disabled><div class="toggl-button-text">Add tags</div><span>▼</span></div>' +
      '</div>' +
      '<div id="toggl-button-update">DONE</div>' +
      '</from>' +
    '</div>',

  checkUrl: function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && /toggl\.com\/app\/index/.test(tab.url)) {
      TogglButton.fetchUser();
    }
  },

  fetchUser: function (token) {
    TogglButton.ajax('/me?with_related_data=true', {
      token: token || ' ',
      baseUrl: TogglButton.$ApiV8Url,
      onLoad: function (xhr) {
        var resp, apiToken, projectMap = {}, tagMap = {};
        if (xhr.status === 200) {
          chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: "sync"});
          });
          resp = JSON.parse(xhr.responseText);
          TogglButton.$curEntry = null;
          TogglButton.setBrowserAction(null);
          if (resp.data.projects) {
            resp.data.projects.forEach(function (project) {
              projectMap[project.name] = project;
            });
          }
          if (resp.data.tags) {
            resp.data.tags.forEach(function (tag) {
              tagMap[tag.name] = tag;
            });
          }
          if (resp.data.time_entries) {
            resp.data.time_entries.some(function (entry) {
              if (entry.duration < 0) {
                TogglButton.$curEntry = entry;
                TogglButton.setBrowserAction(entry);
                return true;
              }
              return false;
            });
          }
          TogglButton.$user = resp.data;
          TogglButton.$user.projectMap = projectMap;
          TogglButton.$user.tagMap = tagMap;
          localStorage.removeItem('userToken');
          localStorage.setItem('userToken', resp.data.api_token);
          if (TogglButton.$sendResponse !== null) {
            TogglButton.$sendResponse({success: (xhr.status === 200)});
            TogglButton.$sendResponse = null;
            TogglButton.setBrowserActionBadge();
          }
          if (TogglButton.$socketEnabled) {
            TogglButton.setupSocket();
          }
        } else if (!token) {
          apiToken = localStorage.getItem('userToken');
          if (apiToken) {
            TogglButton.fetchUser(apiToken);
          }
        }
      }
    });
  },

  setupSocket: function () {
    var authenticationMessage, pingResponse;
    try {
      TogglButton.$socket = new WebSocket('wss://stream.toggl.com/ws');
    } catch (error) {
      return;
    }

    authenticationMessage = {
      type: 'authenticate',
      api_token: TogglButton.$user.api_token
    };
    pingResponse = JSON.stringify({
      type: "pong"
    });

    TogglButton.$socket.onopen = function () {
      var data;
      data = JSON.stringify(authenticationMessage);
      try {
        return TogglButton.$socket.send(data);
      } catch (error) {
        console.log("Exception while sending:", error);
      }
    };

    TogglButton.$socket.onerror = function (e) {
      return console.log('onerror: ', e);
    };

    TogglButton.$socket.onclose = function () {
      var retrySeconds = Math.floor(Math.random() * 30);
      if (TogglButton.$retrySocket) {
        setTimeout(TogglButton.setupSocket, retrySeconds * 1000);
        TogglButton.$retrySocket = false;
      }
    };

    TogglButton.$socket.onmessage = function (msg) {
      var data;
      data = JSON.parse(msg.data);
      if (data.model !== null) {
        if (data.model === "time_entry") {
          TogglButton.updateCurrentEntry(data);
        }
      } else if (TogglButton.$socket !== null) {
        try {
          TogglButton.$socket.send(pingResponse);
        } catch (error) {
          console.log("Exception while sending:", error);
        }
      }
    };

  },

  updateCurrentEntry: function (data) {
    var entry = data.data;
    if (data.action === "INSERT") {
      TogglButton.$curEntry = entry;
    } else if (data.action === "UPDATE" && (TogglButton.$curEntry === null || entry.id === TogglButton.$curEntry.id)) {
      if (entry.duration >= 0) {
        entry = null;
      }
      TogglButton.$curEntry = entry;
    }
    TogglButton.setBrowserAction(entry);
  },

  createTimeEntry: function (timeEntry, sendResponse) {
    var project, start = new Date(),
      entry = {
        time_entry: {
          start: start.toISOString(),
          description: timeEntry.description,
          wid: TogglButton.$user.default_wid,
          pid: timeEntry.projectId || null,
          tags: timeEntry.tags || null,
          billable: timeEntry.billable || false,
          duration: -(start.getTime() / 1000),
          created_with: timeEntry.createdWith || TogglButton.$version,
          duronly: !TogglButton.$user.store_start_and_stop_time
        }
      };

    if (timeEntry.projectName !== undefined) {
      project = TogglButton.$user.projectMap[timeEntry.projectName];
      entry.time_entry.pid = project && project.id;
      entry.time_entry.billable = project && project.billable;
    }

    TogglButton.ajax('/time_entries', {
      method: 'POST',
      payload: entry,
      onLoad: function (xhr) {
        var responseData;
        responseData = JSON.parse(xhr.responseText);
        entry = responseData && responseData.data;
        TogglButton.$curEntry = entry;
        TogglButton.setBrowserAction(entry);
        if (!!timeEntry.respond) {
          sendResponse({success: (xhr.status === 200), type: "New Entry", entry: entry, showPostPopup: TogglButton.$showPostPopup, html: TogglButton.getEditForm()});
        }
        if (TogglButton.$timer !== null) {
          clearTimeout(TogglButton.$timer);
        }
      }
    });
  },

  ajax: function (url, opts) {
    var xhr = new XMLHttpRequest(),
      method = opts.method || 'GET',
      baseUrl = opts.baseUrl || TogglButton.$ApiV8Url,
      token = opts.token || (TogglButton.$user && TogglButton.$user.api_token),
      credentials = opts.credentials || null;

    xhr.open(method, baseUrl + url, true);
    if (opts.onLoad) {
      xhr.addEventListener('load', function () { opts.onLoad(xhr); });
    }
    if (token && token !== ' ') {
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa(token + ':api_token'));
    }
    if (credentials) {
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa(credentials.username + ':' + credentials.password));
    }
    xhr.send(JSON.stringify(opts.payload));
  },

  stopTimeEntry: function (timeEntry, sendResponse) {
    if (!TogglButton.$curEntry) { return; }
    var stopTime = new Date(),
      startTime = new Date(-TogglButton.$curEntry.duration * 1000);

    TogglButton.ajax("/time_entries/" + TogglButton.$curEntry.id, {
      method: 'PUT',
      payload: {
        time_entry: {
          stop: stopTime.toISOString(),
          duration: Math.floor(((stopTime - startTime) / 1000))
        }
      },
      onLoad: function (xhr) {
        if (xhr.status === 200) {
          TogglButton.$timer = TogglButton.$curEntry = null;
          TogglButton.setBrowserAction(null);
          if (!!timeEntry.respond) {
            sendResponse({success: true, type: "Stop"});
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {type: "stop-entry"});
            });
          }
          TogglButton.triggerNotification();
        }
      }
    });
  },

  updateTimeEntry: function (timeEntry, sendResponse) {
    var entry;
    if (!TogglButton.$curEntry) { return; }
    TogglButton.ajax("/time_entries/" + TogglButton.$curEntry.id, {
      method: 'PUT',
      payload: {
        time_entry: {
          description: timeEntry.description,
          pid: timeEntry.pid,
          tags: timeEntry.tags
        }
      },
      onLoad: function (xhr) {
        var responseData;
        responseData = JSON.parse(xhr.responseText);
        entry = responseData && responseData.data;
        TogglButton.$curEntry = entry;
        TogglButton.setBrowserAction(entry);
        if (!!timeEntry.respond) {
          sendResponse({success: (xhr.status === 200), type: "Update"});
        }
      }
    });
  },

  setBrowserActionBadge: function () {
    var badge = "";
    if (TogglButton.$user === null) {
      badge = "x";
      TogglButton.setBrowserAction(null);
    }
    chrome.browserAction.setBadgeText(
      {text: badge}
    );
  },

  setBrowserAction: function (runningEntry) {
    var imagePath = {'19': 'images/inactive-19.png', '38': 'images/inactive-38.png'},
      title = chrome.runtime.getManifest().browser_action.default_title;
    if (runningEntry !== null) {
      imagePath = {'19': 'images/active-19.png', '38': 'images/active-38.png'};
      if (!!runningEntry.description && runningEntry.description.length > 0) {
        title = runningEntry.description + " - Toggl";
      } else {
        title = "(no description) - Toggl";
      }
    }
    chrome.browserAction.setTitle({
      title: title
    });
    chrome.browserAction.setIcon({
      path: imagePath
    });
  },

  loginUser: function (request, sendResponse) {
    TogglButton.ajax("/sessions", {
      method: 'POST',
      onLoad: function (xhr) {
        TogglButton.$sendResponse = sendResponse;
        TogglButton.fetchUser();
        TogglButton.refreshPage();
      },
      credentials: {
        username: request.username,
        password: request.password
      }
    });
  },

  logoutUser: function (sendResponse) {
    TogglButton.ajax("/sessions?created_with=" + TogglButton.$version, {
      method: 'DELETE',
      onLoad: function (xhr) {
        TogglButton.$user = null;
        TogglButton.$curEntry = null;
        sendResponse({success: (xhr.status === 200), xhr: xhr});
        TogglButton.refreshPage();
      }
    });
  },

  getEditForm: function () {
    if (TogglButton.$user === null) {
      return "";
    }
    return TogglButton.$editForm
        .replace("{projects}", TogglButton.fillProjects())
        .replace("{tags}", TogglButton.fillTags());
  },

  fillProjects: function () {
    var html = "<option value='0'>- No Project -</option>",
      projects = TogglButton.$user.projectMap,
      key = null;
    for (key in projects) {
      if (projects.hasOwnProperty(key)) {
        html += "<option value='" + projects[key].id + "'>" + key + "</option>";
      }
    }
    return html;
  },

  fillTags: function () {
    var html = "",
      tags = TogglButton.$user.tagMap,
      key = null;

    for (key in tags) {
      if (tags.hasOwnProperty(key)) {
        html += "<option value='" + tags[key].name + "'>" + key + "</option>";
      }
    }
    return html;
  },

  refreshPage: function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.reload(tabs[0].id);
    });
  },

  setSocket: function (state) {
    localStorage.setItem("socketEnabled", state);
    TogglButton.$socketEnabled = state;
    if (state) {
      if (TogglButton.$socket !== null) {
        TogglButton.$socket.close();
        TogglButton.$socket = null;
      }
      TogglButton.setupSocket();
    } else {
      TogglButton.$socket.close();
      TogglButton.$socket = null;
    }
  },

  setNanny: function (state) {
    localStorage.setItem("idleCheckEnabled", state);
    TogglButton.$idleCheckEnabled = state;
    if (state) {
      TogglButton.triggerNotification();
    }
  },

  setNannyFromTo: function (state) {
    localStorage.setItem("idleFromTo", state);
    TogglButton.$idleFromTo = state;
    if (TogglButton.$idleCheckEnabled) {
      TogglButton.triggerNotification();
    }
  },

  setNannyInterval: function (state) {
    localStorage.setItem("idleInterval", Math.max(state, 1000));
    TogglButton.$idleInterval = state;
    if (TogglButton.$idleCheckEnabled) {
      TogglButton.triggerNotification();
    }
  },

  checkState: function () {
    chrome.idle.queryState(15, TogglButton.checkActivity);
  },

  checkActivity: function (currentState) {
    clearTimeout(TogglButton.$timer);
    TogglButton.$timer = null;
    if (currentState === "active" && TogglButton.$idleCheckEnabled && TogglButton.$curEntry === null && TogglButton.workingTime()) {
      chrome.notifications.create(
        'remind-to-track-time',
        {
          type: 'basic',
          iconUrl: 'images/icon-128.png',
          title: "Toggl Button",
          message: "Don't forget to track your time!"
        },
        function () {
          return;
        }
      );
    }
  },

  workingTime: function () {
    var now = new Date(),
      fromTo = TogglButton.$idleFromTo.split("-"),
      start,
      end,
      startHelper,
      endHelper;

    if (now.getDay() === 6 || now.getDay() === 0) {
      return false;
    }
    startHelper = fromTo[0].split(":");
    endHelper = fromTo[1].split(":");
    start = new Date();
    start.setHours(startHelper[0]);
    start.setMinutes(startHelper[1]);
    end = new Date();
    end.setHours(endHelper[0]);
    end.setMinutes(endHelper[1]);
    return (now > start && now <= end);
  },

  triggerNotification: function () {
    if (TogglButton.$timer === null && TogglButton.$curEntry === null) {
      TogglButton.hideNotification();
      TogglButton.$timer = setTimeout(TogglButton.checkState, TogglButton.$idleInterval);
    }
  },

  hideNotification: function () {
    chrome.notifications.clear(
      'remind-to-track-time',
      function () {
        return;
      }
    );
  },

  checkDailyUpdate: function () {
    var d = new Date(),
      currentDate = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
    if (TogglButton.$lastSyncDate === null || TogglButton.$lastSyncDate !== currentDate) {
      TogglButton.fetchUser();
      TogglButton.$lastSyncDate = currentDate;
    }
  },

  loadSetting: function (setting) {
    var value = localStorage.getItem(setting);
    return !(value !== null && (value === "false" || !value));
  },

  newMessage: function (request, sender, sendResponse) {
    if (request.type === 'activate') {
      TogglButton.checkDailyUpdate();
      TogglButton.setBrowserActionBadge();
      sendResponse({success: TogglButton.$user !== null, user: TogglButton.$user});
      TogglButton.triggerNotification();
    } else if (request.type === 'login') {
      TogglButton.loginUser(request, sendResponse);
    } else if (request.type === 'logout') {
      TogglButton.logoutUser(sendResponse);
    } else if (request.type === 'sync') {
      TogglButton.fetchUser();
    } else if (request.type === 'timeEntry') {
      TogglButton.createTimeEntry(request, sendResponse);
      TogglButton.hideNotification();
    } else if (request.type === 'update') {
      TogglButton.updateTimeEntry(request, sendResponse);
    } else if (request.type === 'stop') {
      TogglButton.stopTimeEntry(request, sendResponse);
    } else if (request.type === 'toggle-popup') {
      localStorage.setItem("showPostPopup", request.state);
      TogglButton.$showPostPopup = request.state;
    } else if (request.type === 'toggle-socket') {
      TogglButton.setSocket(request.state);
    } else if (request.type === 'toggle-nanny') {
      TogglButton.setNanny(request.state);
    } else if (request.type === 'toggle-nanny-from-to') {
      TogglButton.setNannyFromTo(request.state);
    } else if (request.type === 'toggle-nanny-interval') {
      TogglButton.setNannyInterval(request.state);
    } else if (request.type === 'userToken') {
      if (!TogglButton.$user) {
        TogglButton.fetchUser(request.apiToken);
      }
    } else if (request.type === 'currentEntry') {
      sendResponse({success: TogglButton.$curEntry !== null, currentEntry: TogglButton.$curEntry});
    }
    return true;
  }
};

TogglButton.fetchUser();
TogglButton.$showPostPopup = TogglButton.loadSetting("showPostPopup");
TogglButton.$socketEnabled = TogglButton.loadSetting("socketEnabled");
TogglButton.$idleCheckEnabled = TogglButton.loadSetting("idleCheckEnabled");
TogglButton.$idleInterval = !!localStorage.getItem("idleInterval") ? localStorage.getItem("idleInterval") : 360000;
TogglButton.$idleFromTo = !!localStorage.getItem("idleFromTo") ? localStorage.getItem("idleFromTo") : "09:00-17:00";
TogglButton.triggerNotification();
chrome.tabs.onUpdated.addListener(TogglButton.checkUrl);
chrome.extension.onMessage.addListener(TogglButton.newMessage);
chrome.notifications.onClosed.addListener(TogglButton.triggerNotification);
chrome.notifications.onClicked.addListener(TogglButton.triggerNotification);