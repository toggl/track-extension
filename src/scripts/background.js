/*jslint indent: 2, unparam: true, plusplus: true, nomen: true */
/*global window: false, Db: false, XMLHttpRequest: false, WebSocket: false, chrome: false, btoa: false, localStorage:false, document: false, Audio: false, Bugsnag: false */
"use strict";
var TogglButton;

Bugsnag.apiKey = "7419717b29de539ab0fbe35dcd7ca19d";
Bugsnag.appVersion = chrome.runtime.getManifest().version;

Bugsnag.beforeNotify = function (error, metaData) {
  error.stacktrace = error.stacktrace.replace(/chrome-extension:/g, "chromeextension:");
};

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (info) {
    var headers = info.requestHeaders;
    headers.forEach(function (header, i) {
      if (header.name.toLowerCase() === 'user-agent') {
        header.value = TogglButton.$fullVersion;
      }
    });
    return {requestHeaders: headers};
  },
  {
    urls: [ "https://www.toggl.com/*" ],
    types: ["xmlhttprequest"]
  },
  ["blocking", "requestHeaders"]
);

var _gaq = window._gaq || [];
_gaq.push(['_setAccount', 'UA-3215787-22']);
_gaq.push(['_trackPageview']);

(function () {
  var ga = document.createElement('script'),
    s = document.getElementsByTagName('script')[0];
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  s.parentNode.insertBefore(ga, s);
}());

TogglButton = {
  $user: null,
  $curEntry: null,
  $latestStoppedEntry: null,
  $ApiV8Url: "https://www.toggl.com/api/v8",
  $sendResponse: null,
  $socket: null,
  $retrySocket: false,
  $nannyTimer: null,
  $lastSyncDate: null,
  $lastWork: {
    id: null,
    date: Date.now()
  },
  $checkingUserState: false,
  $userState: 'active',
  $fullVersion: ("TogglButton/" + chrome.runtime.getManifest().version),
  $version: (chrome.runtime.getManifest().version),
  $editForm: '<div id="toggl-button-edit-form">' +
      '<form autocomplete="off">' +
      '<a class="toggl-button {service} active" href="#">Stop timer</a>' +
      '<a id="toggl-button-hide">&times;</a>' +
      '<div class="toggl-button-row">' +
        '<input name="toggl-button-description" type="text" id="toggl-button-description" class="toggl-button-input" value="" placeholder="(no description)" autocomplete="off">' +
      '</div>' +
      '<div class="toggl-button-row">' +
        '<select class="toggl-button-input" id="toggl-button-project" name="toggl-button-project">{projects}</select>' +
        '<div id="toggl-button-project-placeholder" class="toggl-button-input" disabled><span class="project-bullet"></span><div class="toggl-button-text">Add project</div><span>▼</span></div>' +
      '</div>' +
      '<div class="toggl-button-row" id="toggl-button-tasks-row">' +
        '<select class="toggl-button-input" id="toggl-button-task" name="toggl-button-task"></select>' +
        '<div id="toggl-button-task-placeholder" class="toggl-button-input" disabled><div class="toggl-button-text">Add task</div><span>▼</span></div>' +
      '</div>' +
      '<div class="toggl-button-row">' +
        '<select class="toggl-button-input" id="toggl-button-tag" name="toggl-button-tag" multiple>{tags}</select>' +
        '<div id="toggl-button-tag-placeholder" class="toggl-button-input" disabled><div class="toggl-button-text">Add tags</div><span>▼</span></div>' +
      '</div>' +
      '<div id="toggl-button-update">DONE</div>' +
      '</from>' +
    '</div>',

  fetchUser: function (token) {
    TogglButton.ajax('/me?with_related_data=true', {
      token: token || ' ',
      baseUrl: TogglButton.$ApiV8Url,
      onLoad: function (xhr) {
        var resp, apiToken, projectMap = {}, clientMap = {}, clientNameMap = {}, tagMap = {}, projectTaskList = null;
        try {
          if (xhr.status === 200) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
              try {
                if (!!tabs[0]) {
                  chrome.tabs.sendMessage(tabs[0].id, {type: "sync"});
                }
              } catch (e) {
                Bugsnag.notifyException(e);
              }
            });
            resp = JSON.parse(xhr.responseText);
            TogglButton.$curEntry = null;
            TogglButton.setBrowserAction(null);
            if (resp.data.projects) {
              resp.data.projects.forEach(function (project) {
                if (project.active && !project.server_deleted_at) {
                  projectMap[project.name + project.id] = project;
                }
              });
            }
            if (resp.data.clients) {
              resp.data.clients.forEach(function (client) {
                clientMap[client.id] = client;
                clientNameMap[client.name.toLowerCase()] = client;
              });
            }
            if (resp.data.tags) {
              resp.data.tags.forEach(function (tag) {
                tagMap[tag.name] = tag;
              });
            }
            if (resp.data.tasks) {
              projectTaskList = {};
              resp.data.tasks.forEach(function (task) {
                var pid = task.pid;
                if (!projectTaskList[pid]) { projectTaskList[pid] = []; }
                projectTaskList[pid].push(task);
              });
            }
            if (resp.data.time_entries) {
              resp.data.time_entries.some(function (entry) {
                if (entry.duration < 0) {
                  TogglButton.$curEntry = entry;
                  TogglButton.setBrowserAction(entry);
                  TogglButton.startCheckingUserState();
                  return true;
                }
                return false;
              });
            }
            TogglButton.$user = resp.data;
            TogglButton.$user.projectMap = projectMap;
            TogglButton.$user.clientMap = clientMap;
            TogglButton.$user.clientNameMap = clientNameMap;
            TogglButton.$user.tagMap = tagMap;
            TogglButton.$user.projectTaskList = projectTaskList;
            localStorage.removeItem('userToken');
            localStorage.setItem('userToken', resp.data.api_token);
            if (TogglButton.$sendResponse !== null) {
              TogglButton.$sendResponse({success: (xhr.status === 200)});
              TogglButton.$sendResponse = null;
            }
            TogglButton.setBrowserActionBadge();
            if (Db.get("socketEnabled")) {
              TogglButton.setupSocket();
            }
            TogglButton.updateBugsnag();
          } else if (!token) {
            apiToken = localStorage.getItem('userToken');
            if (apiToken) {
              TogglButton.fetchUser(apiToken);
            }
          } else {
            TogglButton.setBrowserActionBadge();
          }
        } catch (e) {
          Bugsnag.notifyException(e);
        }
      }
    });
  },

  updateBugsnag: function () {
    // Set user data
    Bugsnag.user = {
      id: TogglButton.$user.id
    };
  },

  setupSocket: function () {
    var authenticationMessage, pingResponse;
    try {
      TogglButton.$socket = new WebSocket('wss://stream.toggl.com/ws');
    } catch (e) {
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
        TogglButton.$latestStoppedEntry = entry;
        TogglButton.updateEntriesDb();
        entry = null;
      }
      TogglButton.$curEntry = entry;
    }
    TogglButton.startCheckingUserState();
    TogglButton.setBrowserAction(entry);
  },

  updateEntriesDb: function () {
    var added = false,
      index,
      entry;

    if (!TogglButton.$user) {
      TogglButton.fetchUser();
      return;
    }

    if (!TogglButton.$user.time_entries || !Object.keys(TogglButton.$user.time_entries).length) {
      TogglButton.$user.time_entries = [];
    } else {
      for (index in TogglButton.$user.time_entries) {
        if (TogglButton.$user.time_entries.hasOwnProperty(index)) {
          entry = TogglButton.$user.time_entries[index];
          if (entry.id === TogglButton.$latestStoppedEntry.id) {
            TogglButton.$user.time_entries[index] = TogglButton.$latestStoppedEntry;
            added = true;
          }
        }
      }
    }

    // entry not present in entries array. Let's add it
    if (!added) {
      TogglButton.$user.time_entries.push(TogglButton.$latestStoppedEntry);
    }
  },

  findProjectByName: function (name) {
    var key;
    for (key in TogglButton.$user.projectMap) {
      if (TogglButton.$user.projectMap.hasOwnProperty(key) && TogglButton.$user.projectMap[key].name === name) {
        return TogglButton.$user.projectMap[key];
      }
    }
    return undefined;
  },

  findProjectByPid: function (pid) {
    var key;
    for (key in TogglButton.$user.projectMap) {
      if (TogglButton.$user.projectMap.hasOwnProperty(key) && TogglButton.$user.projectMap[key].id === pid) {
        return TogglButton.$user.projectMap[key];
      }
    }
    return undefined;
  },

  createTimeEntry: function (timeEntry, sendResponse) {
    var project, start = new Date(),
      error = "",
      entry = {
        time_entry: {
          start: start.toISOString(),
          description: timeEntry.description || "",
          wid: timeEntry.wid || TogglButton.$user.default_wid,
          pid: timeEntry.pid || timeEntry.projectId || null,
          tid: timeEntry.tid || null,
          tags: timeEntry.tags || null,
          billable: timeEntry.billable || false,
          duration: -(start.getTime() / 1000),
          created_with: timeEntry.createdWith || TogglButton.$fullVersion,
          duronly: timeEntry.duronly || !TogglButton.$user.store_start_and_stop_time
        }
      };

    if (timeEntry.projectName !== null && !entry.time_entry.pid) {
      project = TogglButton.findProjectByName(timeEntry.projectName);
      entry.time_entry.pid = project && project.id;
      entry.time_entry.billable = project && project.billable;
    }

    TogglButton.ajax('/time_entries', {
      method: 'POST',
      payload: entry,
      onLoad: function (xhr) {
        var responseData,
          success = (xhr.status === 200);
        try {
          if (success) {
            responseData = JSON.parse(xhr.responseText);
            entry = responseData && responseData.data;
            TogglButton.$curEntry = entry;
            TogglButton.setBrowserAction(entry);
            clearTimeout(TogglButton.$nannyTimer);
            TogglButton.startCheckingUserState();
            TogglButton.analytics(timeEntry.type, timeEntry.service);
          } else {
            error = xhr.responseText;
          }
          if (!!timeEntry.respond) {
            sendResponse(
              {
                success: success,
                type: "New Entry",
                entry: entry,
                showPostPopup: Db.get("showPostPopup"),
                html: TogglButton.getEditForm(),
                hasTasks: !!TogglButton.$user.projectTaskList,
                error: error
              }
            );
          }
        } catch (e) {
          Bugsnag.notifyException(e);
        }
      }
    });

    if (Db.get("pomodoroModeEnabled")) {
      chrome.alarms.create('PomodoroTimer', {delayInMinutes: parseInt(Db.get("pomodoroInterval"), 10)});
    }
  },

  analytics: function (event, service) {
    if (event === "settings") {
      _gaq.push(['_trackEvent', 'rightclickbutton', "settings/show-right-click-button-" + Db.get("showRightClickButton")]);
      _gaq.push(['_trackEvent', 'popup', "settings/popup-" + Db.get("showPostPopup")]);
      _gaq.push(['_trackEvent', 'reminder', "settings/reminder-" + Db.get("nannyCheckEnabled")]);
      _gaq.push(['_trackEvent', 'idle', "settings/idle-detection-" + Db.get("idleDetectionEnabled")]);
      _gaq.push(['_trackEvent', 'websocket', "settings/websocket-" + Db.get("socketEnabled")]);
      _gaq.push(['_trackEvent', 'pomodoro', "settings/pomodoro-" + Db.get("pomodoroModeEnabled")]);
      _gaq.push(['_trackEvent', 'pomodoro-sound', "settings/pomodoro-sound-" + Db.get("pomodoroSoundEnabled")]);
    } else {
      _gaq.push(['_trackEvent', event, event + "-" + service]);
      chrome.runtime.getPlatformInfo(function (info) {
        _gaq.push(['_trackEvent', "os", "os-" + info.os]);
      });
    }
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

  stopTimeEntry: function (timeEntry, sendResponse, cb) {
    if (!TogglButton.$curEntry) { return; }
    var stopTime = timeEntry.stopDate || new Date(),
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
          TogglButton.$latestStoppedEntry = JSON.parse(xhr.responseText).data;
          TogglButton.updateEntriesDb();
          TogglButton.$nannyTimer = TogglButton.$curEntry = null;
          TogglButton.stopCheckingUserState();
          TogglButton.setBrowserAction(null);
          if (!!timeEntry.respond) {
            sendResponse({success: true, type: "Stop"});
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
              if (!!tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {type: "stop-entry", user: TogglButton.$user});
              }
            });
          }

          chrome.alarms.clear('PomodoroTimer');

          TogglButton.triggerNotification();
          TogglButton.analytics(timeEntry.type, timeEntry.service);
          if (cb) {
            cb();
          }
        }
      }
    });
  },

  pomodoroAlarmStop: function (alarm) {
    if (!Db.get("pomodoroModeEnabled")) {
      return;
    }
    if (alarm.name === 'PomodoroTimer') {
      TogglButton.stopTimeEntry({type: 'pomodoro-stop'});

      var notificationId = 'pomodoro-time-is-up',
        stopSound;
      TogglButton.hideNotification(notificationId);
      chrome.notifications.create(
        notificationId,
        {
          type: 'basic',
          iconUrl: 'images/icon-128.png',
          title: "Toggl Button",
          message: "Time is up! Take a break",
          priority: 2,
          buttons: [
            { title: "Continue Latest"},
            { title: "Start New"}
          ]
        },
        function () {
          return;
        }
      );

      if (Db.get("pomodoroSoundEnabled")) {
        stopSound = new Audio();
        stopSound.src = 'sounds/time_is_up_1.mp3'; //As an option we can add multiple sounds and make it configurable
        stopSound.play();
      }
    }

    return true;
  },

  updateTimeEntry: function (timeEntry, sendResponse) {
    var entry, project, error = "";
    if (!TogglButton.$curEntry) { return; }
    entry = {
      time_entry: {
        description: timeEntry.description,
        pid: timeEntry.pid,
        tags: timeEntry.tags,
        tid: timeEntry.tid
      }
    };

    if (timeEntry.pid !== null && timeEntry.projectName !== null) {
      project = TogglButton.$user.projectMap[timeEntry.projectName + timeEntry.pid];
      entry.time_entry.billable = project && project.billable;
    }

    TogglButton.ajax("/time_entries/" + TogglButton.$curEntry.id, {
      method: 'PUT',
      payload: entry,
      onLoad: function (xhr) {
        var responseData,
          success = (xhr.status === 200);
        try {
          if (success) {
            responseData = JSON.parse(xhr.responseText);
            entry = responseData && responseData.data;
            TogglButton.$curEntry = entry;
            TogglButton.setBrowserAction(entry);
          } else {
            error = xhr.responseText;
          }
          if (!!timeEntry.respond) {
            sendResponse({success: success, type: "Update", error: error});
          }
          TogglButton.analytics(timeEntry.type, timeEntry.service);
        } catch (e) {
          Bugsnag.notifyException(e);
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
    if (!!runningEntry) {
      imagePath = {'19': 'images/active-19.png', '38': 'images/active-38.png'};
      if (!!runningEntry.description && runningEntry.description.length > 0) {
        title = runningEntry.description + " - Toggl";
      } else {
        title = "(no description) - Toggl";
      }
      chrome.browserAction.setBadgeText(
        {text: ""}
      );
    }
    chrome.browserAction.setTitle({
      title: title
    });
    chrome.browserAction.setIcon({
      path: imagePath
    });
    TogglButton.updatePopup();
  },

  loginUser: function (request, sendResponse) {
    TogglButton.ajax("/sessions", {
      method: 'POST',
      onLoad: function (xhr) {
        TogglButton.$sendResponse = sendResponse;
        if (xhr.status === 200) {
          TogglButton.fetchUser();
          TogglButton.refreshPage();
        } else {
          sendResponse({success: false, xhr: xhr});
        }
      },
      credentials: {
        username: request.username,
        password: request.password
      }
    });
  },

  logoutUser: function (sendResponse) {
    TogglButton.ajax("/sessions?created_with=" + TogglButton.$fullVersion, {
      method: 'DELETE',
      onLoad: function (xhr) {
        TogglButton.$user = null;
        TogglButton.$curEntry = null;
        localStorage.setItem('userToken', null);
        sendResponse({success: (xhr.status === 200), xhr: xhr});
        if (xhr.status === 200) {
          TogglButton.setBrowserActionBadge();
        }
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
      clients =  TogglButton.$user.clientMap,
      clientNames = TogglButton.$user.clientNameMap,
      wsHtml = {},
      clientHtml = {},
      client,
      project,
      key = null,
      ckey = null,
      keys = [],
      clientName = 0,
      i,
      validate = function (item) {
        return item.indexOf("</option>") !== -1 &&
          !!item &&
          ((item.match(/\/option/g) || []).length > 1 || item.length > 1);
      };

    try {
      // Sort clients
      for (key in clientNames) {
        if (clientNames.hasOwnProperty(key)) {
          keys.push(key.toLowerCase());
        }
      }
      keys.sort();

      if (TogglButton.$user.workspaces.length > 1) {

        // Add Workspace names
        TogglButton.$user.workspaces.forEach(function (element, index) {
          wsHtml[element.id] = {};
          wsHtml[element.id][0] = '<option disabled="disabled">  ---  ' + element.name.toUpperCase() + '  ---  </option>';
        });

        // Add client optgroups
        for (i = 0; i < keys.length; i++) {
          client = clientNames[keys[i]];
          wsHtml[client.wid][client.name + client.id] = '<optgroup label="' + client.name + '">';
        }

        // Add projects
        for (key in projects) {
          if (projects.hasOwnProperty(key)) {
            project = projects[key];
            clientName = (!!project.cid && !!clients[project.cid]) ? (clients[project.cid].name + project.cid) : 0;
            wsHtml[project.wid][clientName] += "<option value='" + project.id + "'>" + project.name + "</option>";
          }
        }

        // create html
        for (key in wsHtml) {
          if (wsHtml.hasOwnProperty(key)) {
            Object.keys(wsHtml[key]).sort();
            for (ckey in wsHtml[key]) {
              if (wsHtml[key].hasOwnProperty(ckey) && validate(wsHtml[key][ckey])) {
                html += wsHtml[key][ckey] + "</optgroup>";
              }
            }
          }
        }

      } else {

        // Add clients

        for (i = 0; i < keys.length; i++) {
          client = clientNames[keys[i]];
          clientHtml[client.name + client.id] = '<optgroup label="' + client.name + '">';
        }

        // Add projects

        for (key in projects) {
          if (projects.hasOwnProperty(key)) {
            project = projects[key];
            clientName = (!!project.cid) ? (clients[project.cid].name + project.cid) : 0;
            clientHtml[clientName] += "<option value='" + project.id + "'>" + project.name + "</option>";
          }
        }

        // Create html

        for (key in clientHtml) {
          if (clientHtml.hasOwnProperty(key) && clientHtml[key].indexOf("</option>") !== -1) {
            html += clientHtml[key];
            if (key !== "0") {
              html += "</optgroup>";
            }
          }
        }
      }
    } catch (e) {
      Bugsnag.notifyException(e);
    }

    return html;
  },

  fillTags: function () {
    var html = "",
      tags = TogglButton.$user.tagMap,
      i,
      key = null,
      keys = [];

    for (key in tags) {
      if (tags.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    keys.sort();

    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      html += "<option value='" + tags[key].name + "'>" + key + "</option>";
    }
    return html;
  },

  fillTasks: function (projectId) {
    if (TogglButton.$user && TogglButton.$user.projectTaskList) {
      var tasks = TogglButton.$user.projectTaskList[projectId];

      if (tasks) {
        return [{id: 0, name: '- No Task -'}]
          .concat(tasks)
            .map(function (task) { return '<option value="' + task.id + '">' + task.name + '</option>'; })
            .join("");
      }
    }

    return "";
  },

  refreshPage: function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      if (!!tabs[0]) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  },

  /**
   * Start checking whether the user is 'active', 'idle' or 'locked' for the
   * discard time notification.
   */
  startCheckingUserState: function () {
    if (!TogglButton.$checkingState &&
        Db.get("idleDetectionEnabled") &&
        TogglButton.$curEntry) {
      TogglButton.$checkingUserState = setTimeout(function () {
        chrome.idle.queryState(15, TogglButton.onUserState);
      }, 2 * 1000);
    }
  },

  stopCheckingUserState: function () {
    clearTimeout(TogglButton.$checkingUserState);
    TogglButton.$checkingUserState = false;
  },

  timeStringFromSeconds: function (s) {
    var seconds = 0,
      minutes = 0,
      hours = 0;
    minutes = Math.floor(s / 60);
    seconds = s % 60;
    hours = Math.floor(minutes / 60);
    minutes %= 60;
    if (hours > 0) {
      return hours + "h " + minutes + "m";
    }
    if (minutes > 0) {
      return minutes + "m " + seconds + "s";
    }
    return seconds + "s";
  },

  showIdleDetectionNotification: function (seconds) {
    var timeString = TogglButton.timeStringFromSeconds(seconds),
      entryDescription = TogglButton.$curEntry.description || "(no description)",
      notificationOptions = {
        type: 'basic',
        iconUrl: 'images/icon-128.png',
        title: "Toggl Button",
        message: "You've been idle for " + timeString +
          " while tracking \"" + entryDescription + "\"",
        buttons: [
          { title: "Discard idle time" },
          { title: "Discard idle and continue" }
        ]
      };
    TogglButton.$idleNotificationDiscardSince = TogglButton.$lastWork.date;
    TogglButton.hideNotification('idle-detection');
    chrome.notifications.create('idle-detection', notificationOptions);
  },

  onUserState: function (state) {
    TogglButton.$userState = state;
    var now = new Date(),
      inactiveSeconds = Math.floor((now - TogglButton.$lastWork.date) / 1000);
    if (TogglButton.$user && state === 'active' && TogglButton.$curEntry) {
      // trigger discard time notification once the user has been idle for
      // at least 5min
      if (TogglButton.$lastWork.id === TogglButton.$curEntry.id &&
          inactiveSeconds >= 5 * 60) {
        TogglButton.showIdleDetectionNotification(inactiveSeconds);
      }
      TogglButton.$lastWork = {
        id: TogglButton.$curEntry.id,
        date: now
      };
    }
    clearTimeout(TogglButton.$checkingUserState);
    TogglButton.$checkingUserState = null;
    TogglButton.startCheckingUserState();
  },

  checkState: function () {
    chrome.idle.queryState(15, TogglButton.checkActivity);
  },

  checkActivity: function (currentState) {
    var secondTitle = "Open toggl.com";
    clearTimeout(TogglButton.$nannyTimer);
    TogglButton.$nannyTimer = null;

    if (!!TogglButton.$latestStoppedEntry && !!TogglButton.$latestStoppedEntry.description) {
      secondTitle = "Continue (" + TogglButton.$latestStoppedEntry.description + ")";
    }

    if (TogglButton.$user && currentState === "active" &&
        Db.get("nannyCheckEnabled") &&
        TogglButton.$curEntry === null &&
        TogglButton.workingTime()) {

      chrome.notifications.create(
        'remind-to-track-time',
        {
          type: 'basic',
          iconUrl: 'images/icon-128.png',
          title: "Toggl Button",
          message: "Don't forget to track your time!",
          buttons: [
            { title: "Start timer"},
            { title: secondTitle}
          ]
        },
        function () {
          return;
        }
      );
    }
  },

  notificationBtnClick: function (notificationId, buttonID) {
    var type = "dropdown-pomodoro",
      timeEntry = TogglButton.$curEntry,
      buttonName = "start_new",
      eventType = "reminder";
    if (notificationId === 'remind-to-track-time') {
      type = "dropdown-reminder";
      if (buttonID === 0) {
        // start timer
        TogglButton.createTimeEntry({"type": "timeEntry", "service": type}, null);
      } else {
        timeEntry = TogglButton.$latestStoppedEntry;
        if (!!timeEntry && !!timeEntry.description) {
          timeEntry.type = "timeEntry";
          timeEntry.service = type;
          // continue timer
          TogglButton.createTimeEntry(timeEntry, null);
          buttonName = "continue";
        } else {
          chrome.tabs.create({url: 'https://toggl.com/app/'});
          buttonName = "go_to_web";
        }
      }
    } else if (notificationId === 'idle-detection') {
      if (buttonID === 0 || buttonID === 1) {
        buttonName = "discard";
        // discard idle time
        TogglButton.stopTimeEntry({
          stopDate: TogglButton.$idleNotificationDiscardSince,
          type: 'idle-detection-notification'
        }, null, function () {
          // discard idle time and continue
          if (buttonID === 1) {
            TogglButton.createTimeEntry(timeEntry);
            buttonName = "discard_continue";
          }
        });
      }
      eventType = "idle";
    } else if (notificationId === 'pomodoro-time-is-up') {
      if (buttonID === 0) {
        timeEntry = TogglButton.$latestStoppedEntry;
        if (!!timeEntry) {
          timeEntry.type = "timeEntry";
          timeEntry.service = type;
        } else {
          timeEntry = {"type": "timeEntry", "service": type};
        }
        // continue timer
        TogglButton.createTimeEntry(timeEntry, null);
        buttonName = "continue";
      } else {
        // start timer
        TogglButton.createTimeEntry({"type": "timeEntry", "service": type}, null);
      }
      eventType = "pomodoro";
    }
    TogglButton.processNotificationEvent(notificationId);
    TogglButton.analytics(eventType, buttonName);
  },

  workingTime: function () {
    var now = new Date(),
      fromTo = Db.get("nannyFromTo").split("-"),
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
    if (TogglButton.$nannyTimer === null && TogglButton.$curEntry === null) {
      TogglButton.hideNotification('remind-to-track-time');
      TogglButton.$nannyTimer = setTimeout(TogglButton.checkState, Db.get("nannyInterval"));
    }
  },

  processNotificationEvent: function (notificationId) {
    if (notificationId === 'remind-to-track-time') {
      TogglButton.triggerNotification();
    } else {
      TogglButton.hideNotification(notificationId);
    }
  },

  hideNotification: function (notificationId) {
    chrome.notifications.clear(
      notificationId,
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

  updatePopup: function () {
    var popup = chrome.extension.getViews({"type": "popup"});
    if (!!popup && popup.length && !!popup[0].PopUp) {
      popup[0].PopUp.showPage();
    }
  },

  contextMenuClick: function (info, tab) {
    TogglButton.createTimeEntry({"type": "timeEntry", "service": "contextMenu", "description": info.selectionText || ""}, null);
  },

  newMessage: function (request, sender, sendResponse) {
    try {
      if (request.type === 'activate') {
        TogglButton.checkDailyUpdate();
        TogglButton.setBrowserActionBadge();
        sendResponse({success: TogglButton.$user !== null, user: TogglButton.$user, version: TogglButton.$fullVersion});
        TogglButton.triggerNotification();
      } else if (request.type === 'login') {
        TogglButton.loginUser(request, sendResponse);
      } else if (request.type === 'logout') {
        TogglButton.logoutUser(sendResponse);
      } else if (request.type === 'sync') {
        TogglButton.fetchUser();
      } else if (request.type === 'timeEntry') {
        TogglButton.createTimeEntry(request, sendResponse);
        TogglButton.hideNotification('remind-to-track-time');
      } else if (request.type === 'resume') {
        TogglButton.createTimeEntry(TogglButton.$latestStoppedEntry, sendResponse);
        TogglButton.hideNotification('remind-to-track-time');
      } else if (request.type === 'update') {
        TogglButton.updateTimeEntry(request, sendResponse);
      } else if (request.type === 'stop') {
        TogglButton.stopTimeEntry(request, sendResponse);
      } else if (request.type === 'userToken') {
        if (!TogglButton.$user) {
          TogglButton.fetchUser(request.apiToken);
        }
      } else if (request.type === 'currentEntry') {
        sendResponse({success: TogglButton.$curEntry !== null, currentEntry: TogglButton.$curEntry});
      } else if (request.type === 'getTasksHtml') {
        var success = TogglButton.$user && TogglButton.$user.projectTaskList;

        sendResponse({
          success: success,
          html: success ? TogglButton.fillTasks(request.projectId) : ''
        });
      }

    } catch (e) {
      Bugsnag.notifyException(e);
    }

    return true;
  },

  toggleRightClickButton: function (show) {
    if (show) {
      chrome.contextMenus.create({"title": "Start timer", "contexts": ["page"], "onclick": TogglButton.contextMenuClick});
      chrome.contextMenus.create({"title": "Start timer with description '%s'", "contexts": ["selection"], "onclick": TogglButton.contextMenuClick});
    } else {
      chrome.contextMenus.removeAll();
    }
  }
};

TogglButton.toggleRightClickButton(Db.get("showRightClickButton"));
TogglButton.fetchUser();
TogglButton.triggerNotification();
TogglButton.startCheckingUserState();
chrome.alarms.onAlarm.addListener(TogglButton.pomodoroAlarmStop);
chrome.extension.onMessage.addListener(TogglButton.newMessage);
chrome.notifications.onClosed.addListener(TogglButton.processNotificationEvent);
chrome.notifications.onClicked.addListener(TogglButton.processNotificationEvent);
chrome.notifications.onButtonClicked.addListener(TogglButton.notificationBtnClick);
