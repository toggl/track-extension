/*jslint indent: 2, unparam: true, plusplus: true, nomen: true */
/*global window: false, Db: false, XMLHttpRequest: false, Image: false, WebSocket: false, navigator: false, chrome: false, btoa: false, localStorage:false, document: false, Audio: false, Bugsnag: false */
"use strict";

var TogglButton,
  openWindowsCount = 0,
  FF = navigator.userAgent.indexOf("Chrome") === -1,
  debug = false,
  entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  },
  escapeHtml = function (string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  };

Bugsnag.apiKey = "7419717b29de539ab0fbe35dcd7ca19d";
Bugsnag.appVersion = chrome.runtime.getManifest().version;

Bugsnag.beforeNotify = function (error, metaData) {
  error.stacktrace = error.stacktrace.replace(/chrome-extension:/g, "chromeextension:");
};

var report = function (e) {
  if (debug) {
    console.log(e);
  } else {
    Bugsnag.notifyException(e);
  }
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
  checkingWorkdayEnd: false,
  pomodoroAlarm: null,
  pomodoroProgressTimer: null,
  $userState: 'active',
  $fullVersion: ("TogglButton/" + chrome.runtime.getManifest().version),
  $version: (chrome.runtime.getManifest().version),
  queue: [],
  $editForm: '<div id="toggl-button-edit-form">' +
      '<form autocomplete="off">' +
      '<a class="toggl-button {service} active" href="#">Stop timer</a>' +
      '<a id="toggl-button-hide">&times;</a>' +
      '<div class="toggl-button-row">' +
        '<input name="toggl-button-description" tabindex="100" type="text" id="toggl-button-description" class="toggl-button-input" value="" placeholder="(no description)" autocomplete="off">' +
      '</div>' +
      '<div class="toggl-button-row">' +
        '<input name="toggl-button-project-filter" tabindex="101" type="text" id="toggl-button-project-filter" class="toggl-button-input" value="" placeholder="Filter Projects" autocomplete="off">' +
        '<a href="#clear" class="filter-clear">&times;</a>' +
        '<div id="toggl-button-project-placeholder" class="toggl-button-input" disabled><span class="project-bullet"></span><div class="toggl-button-text">Add project</div><span>▼</span></div>' +
        '<div id="project-autocomplete">{projects}</div>' +
      '</div>' +
      '<div class="toggl-button-row">' +
        '<input name="toggl-button-tag-filter" tabindex="102" type="text" id="toggl-button-tag-filter" class="toggl-button-input" value="" placeholder="Filter Tags" autocomplete="off">' +
        '<a href="#add" class="add-new-tag">+ Add</a>' +
        '<a href="#clear" class="filter-clear">&times;</a>' +
        '<div id="toggl-button-tag-placeholder" class="toggl-button-input" disabled><div class="toggl-button-text">Add tags</div><span>▼</span></div>' +
        '<div id="tag-autocomplete">' +
        '<div class="tag-clear">Clear selected tags</div>' +
        '{tags}</div>' +
      '</div>' +
      '<div id="toggl-button-update" tabindex="103">DONE</div>' +
      '<input type="submit" class="hidden">' +
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
                report(e);
              }
            });
            resp = JSON.parse(xhr.responseText);
            TogglButton.updateTriggers(null, true);
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
                  TogglButton.updateTriggers(entry, true);
                  return true;
                }
                return false;
              });
            }
            Db.set('projects', JSON.stringify(projectMap));
            Db.set('clients', JSON.stringify(clientMap));
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
            TogglButton.setupSocket();
            TogglButton.updateBugsnag();
            TogglButton.handleQueue();
          } else if (!token) {
            apiToken = localStorage.getItem('userToken');
            if (apiToken) {
              TogglButton.fetchUser(apiToken);
            }
          } else {
            TogglButton.setBrowserActionBadge();
          }
        } catch (e) {
          report(e);
        }
      },
      onError: function (xhr) {
        TogglButton.setBrowserActionBadge();
        if (TogglButton.$sendResponse !== null) {
          TogglButton.$sendResponse(
            {
              success: false,
              type: "login",
              error: "Connectivity error"
            }
          );
          TogglButton.$sendResponse = null;
        }
      }
    });
  },

  handleQueue: function () {
    while (!!TogglButton.queue.length) {
      TogglButton.queue.shift()();
    }
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
      // test for empty json
      if (!msg.data) {
        return;
      }
      data = JSON.parse(msg.data);
      if (data.model !== null) {
        if (data.model === "time_entry") {
          TogglButton.updateCurrentEntry(data, true);
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

  updateTriggers: function (entry, sync) {
    TogglButton.$curEntry = entry;
    if (!sync) {
      if (!!entry) {
        TogglButton.checkPomodoroAlarm(entry);
        clearTimeout(TogglButton.$nannyTimer);
        TogglButton.$nannyTimer = null;
      } else {
        // Clear pomodoro timer
        clearTimeout(TogglButton.pomodoroAlarm);
        clearInterval(TogglButton.pomodoroProgressTimer);
      }
    }
    // Toggle workday end check
    TogglButton.startCheckingDayEnd(!!entry);

    TogglButton.toggleCheckingUserState(!!entry);
    TogglButton.setBrowserAction(entry);
  },

  updateCurrentEntry: function (data, sync) {
    var entry = data.data;
    if (data.action === "INSERT") {
      TogglButton.updateTriggers(entry);
    } else if (data.action === "UPDATE" && (TogglButton.$curEntry === null || entry.id === TogglButton.$curEntry.id)) {
      if (entry.duration >= 0) {
        TogglButton.$latestStoppedEntry = entry;
        TogglButton.updateEntriesDb();
        entry = null;
      }
      TogglButton.updateTriggers(entry, sync);
    }
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
    var key,
      result;

    for (key in TogglButton.$user.projectMap) {
      if (TogglButton.$user.projectMap.hasOwnProperty(key) && TogglButton.$user.projectMap[key].name === name) {
        result = TogglButton.$user.projectMap[key];
        if (result.wid === TogglButton.$user.default_wid) {
          return result;
        }
      }
    }
    return result;
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
      defaultProject = Db.get(TogglButton.$user.id + "-defaultProject"),
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

    // set Default project if needed
    if (!entry.time_entry.pid && !!defaultProject) {
      entry.time_entry.pid = parseInt(defaultProject, 10);
    }

    TogglButton.ajax('/time_entries', {
      method: 'POST',
      payload: entry,
      onLoad: function (xhr) {
        var responseData,
          hasTasks = !!TogglButton.$user && !!TogglButton.$user.projectTaskList,
          success = (xhr.status === 200);
        try {
          if (success) {
            responseData = JSON.parse(xhr.responseText);
            entry = responseData && responseData.data;
            TogglButton.updateTriggers(entry);
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
                hasTasks: hasTasks,
                error: error
              }
            );
          }
        } catch (e) {
          report(e);
        }
      },
      onError: function (xhr) {
        if (!!sendResponse) {
          sendResponse(
            {
              success: false,
              type: "New Entry"
            }
          );
        }
      }
    });
  },

  checkPomodoroAlarm: function (entry) {
    var duration = (new Date() - new Date(entry.start)),
      interval = parseInt(Db.get("pomodoroInterval"), 10) * 60000;
    if (duration < interval) {
      TogglButton.triggerPomodoroAlarm(interval - duration);
    }
  },

  triggerPomodoroAlarm: function (value) {
    if (TogglButton.pomodoroAlarm !== null) {
      clearTimeout(TogglButton.pomodoroAlarm);
      TogglButton.pomodoroAlarm = null;
      clearInterval(TogglButton.pomodoroProgressTimer);
    }
    if (Db.get("pomodoroModeEnabled")) {
      var pomodoroInterval = (parseInt(Db.get("pomodoroInterval"), 10) * 60000),
        interval = value || pomodoroInterval,
        steps = 120,
        elapsedTime = ((pomodoroInterval - interval) / pomodoroInterval);
      TogglButton.pomodoroAlarm = setTimeout(TogglButton.pomodoroAlarmStop, interval);
      TogglButton.pomodoroProgressTimer = setInterval(TogglButton.updatePomodoroProgress(interval, steps, elapsedTime), pomodoroInterval / steps);
    }
  },

  updatePomodoroProgress: function (interval, steps, elapsedTime) {
    var current = 0, intervalCount = 0;
    return function () {
      var key, img, imagePaths = {'19': 'images/active-19.png', '38': 'images/active-38.png'},
        imageData = {}, circ = Math.PI * 2, quart = Math.PI * 0.5, imageLoadedCount = 0,
        imageLoaded = function (key) {
          return function () {
            var canvas = document.createElement('canvas'),
              ctx = canvas.getContext('2d');
            ctx.drawImage(this, 0, 0);
            ctx.beginPath();
            ctx.strokeStyle = '#ffffff';
            ctx.lineCap = 'butt';
            ctx.closePath();
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(this.naturalWidth * 0.5, this.naturalHeight * 0.5, (this.naturalWidth * 0.5) - 1, quart * -1, (circ * current) - quart, false);
            ctx.stroke();
            imageData[key] = ctx.getImageData(0, 0, this.naturalWidth, this.naturalHeight);
            ++imageLoadedCount;
            if (imageLoadedCount === 2) {
              chrome.browserAction.setIcon({
                imageData: imageData
              });
            }
          };
        };
      intervalCount += (interval / steps);
      current = (intervalCount / interval) + elapsedTime;

      if (Db.get("pomodoroModeEnabled")) {
        for (key in imagePaths) {
          if (imagePaths.hasOwnProperty(key)) {
            img = new Image();
            img.onload = imageLoaded(key);
            img.src = imagePaths[key];
          }
        }
      } else {
        clearInterval(TogglButton.pomodoroProgressTimer);
        chrome.browserAction.setIcon({
          path: imagePaths
        });
      }
    };
  },

  analytics: function (event, service) {
    if (event === "settings") {
      _gaq.push(['_trackEvent', 'start-automatically', "settings/start-automatically-" + Db.get("startAutomatically")]);
      _gaq.push(['_trackEvent', 'stop-automatically', "settings/stop-automatically-" + Db.get("stopAutomatically")]);
      _gaq.push(['_trackEvent', 'right-click-button', "settings/show-right-click-button-" + Db.get("showRightClickButton")]);
      _gaq.push(['_trackEvent', 'popup', "settings/popup-" + Db.get("showPostPopup")]);
      _gaq.push(['_trackEvent', 'reminder', "settings/reminder-" + Db.get("nannyCheckEnabled")]);
      _gaq.push(['_trackEvent', 'reminder-minutes', "settings/reminder-minutes-" + Db.get("nannyInterval")]);
      _gaq.push(['_trackEvent', 'idle', "settings/idle-detection-" + Db.get("idleDetectionEnabled")]);

      _gaq.push(['_trackEvent', 'pomodoro', "settings/pomodoro-" + Db.get("pomodoroModeEnabled")]);
      if (Db.get("pomodoroModeEnabled")) {
        _gaq.push(['_trackEvent', 'pomodoro-sound', "settings/pomodoro-sound-" + Db.get("pomodoroSoundEnabled")]);
        if (Db.get("pomodoroSoundEnabled")) {
          _gaq.push(['_trackEvent', 'pomodoro-volume', "settings/pomodoro-volume-" + Db.get("pomodoroSoundVolume")]);
        }
        _gaq.push(['_trackEvent', 'pomodoro-stop', "settings/pomodoro-stop-" + Db.get("pomodoroStopTimeTrackingWhenTimerEnds")]);
        _gaq.push(['_trackEvent', 'pomodoro-interval', "settings/pomodoro-interval-" + Db.get("pomodoroInterval")]);
      }

      _gaq.push(['_trackEvent', 'stop-at-day-end', "settings/stop-at-day-end" + Db.get("stopAtDayEnd")]);
      if (Db.get("stopAtDayEnd")) {
        _gaq.push(['_trackEvent', 'stop-at-day-end-time', "settings/stop-at-day-end-time" + Db.get("dayEndTime")]);
      }

      _gaq.push(['_trackEvent', 'default-project', "settings/default-project" + Db.get("defaultProject")]);
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

    if (opts.onError) {
      xhr.addEventListener('error', function () { opts.onError(xhr); });
    }
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

  resetPomodoroProgress: function (entry) {
    clearInterval(TogglButton.pomodoroProgressTimer);
    TogglButton.pomodoroProgressTimer = null;
    TogglButton.updateTriggers(entry);
  },

  stopTimeEntryPomodoro: function (timeEntry, sendResponse, cb) {
    var entry,
      pomodoroDuration = parseInt(Db.get("pomodoroInterval"), 10) * 60;

    if (!TogglButton.$curEntry) { return; }

    entry = {
      time_entry: {
        duration: pomodoroDuration
      }
    };

    TogglButton.ajax("/time_entries/" + TogglButton.$curEntry.id, {
      method: 'PUT',
      payload: entry,
      onLoad: function (xhr) {
        if (xhr.status === 200) {
          TogglButton.$latestStoppedEntry = JSON.parse(xhr.responseText).data;
          TogglButton.updateEntriesDb();
          TogglButton.resetPomodoroProgress(null);
          if (!!timeEntry.respond) {
            sendResponse({success: true, type: "Stop"});
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
              if (!!tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {type: "stop-entry", user: TogglButton.$user});
              }
            });
          }
          TogglButton.triggerNotification();
          TogglButton.analytics(timeEntry.type, timeEntry.service);
          if (cb) {
            cb();
          }
        }
      },
      onError: function (xhr) {
        sendResponse(
          {
            success: false,
            type: "Update"
          }
        );
      }
    });
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
          TogglButton.resetPomodoroProgress(null);
          if (!!timeEntry.respond) {
            sendResponse({success: true, type: "Stop"});
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
              if (!!tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {type: "stop-entry", user: TogglButton.$user});
              }
            });
          }
          TogglButton.triggerNotification();
          TogglButton.analytics(timeEntry.type, timeEntry.service);
          if (cb) {
            cb();
          }
        }
      },
      onError: function (xhr) {
        sendResponse(
          {
            success: false,
            type: "Stop"
          }
        );
      }
    });
  },

  pomodoroStopTimeTracking: function () {
    if (Db.get("pomodoroStopTimeTrackingWhenTimerEnds")) {
      TogglButton.stopTimeEntryPomodoro({type: 'pomodoro-stop', service: 'dropdown'});
    } else {
      TogglButton.resetPomodoroProgress(TogglButton.$curEntry);
    }
  },

  pomodoroAlarmStop: function () {
    if (!Db.get("pomodoroModeEnabled")) {
      return;
    }

    var notificationId = 'pomodoro-time-is-up',
      stopSound,
      latestDescription = (TogglButton.$curEntry && TogglButton.$curEntry.description) ? " (" + TogglButton.$curEntry.description + ")" : "",
      topButtonTitle = "Continue Latest" + latestDescription,
      bottomButtonTitle = "Start New";

    TogglButton.pomodoroStopTimeTracking();

    if (!Db.get("pomodoroStopTimeTrackingWhenTimerEnds")) {
      notificationId = 'pomodoro-time-is-up-dont-stop';
      topButtonTitle = "Stop timer";
      bottomButtonTitle = "Stop and Start New";
    }

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
          { title: topButtonTitle},
          { title: bottomButtonTitle}
        ]
      },
      function () {
        return;
      }
    );

    if (Db.get("pomodoroSoundEnabled")) {
      stopSound = new Audio();
      stopSound.src = Db.get("pomodoroSoundFile");
      stopSound.volume = Db.get("pomodoroSoundVolume");
      stopSound.play();
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
            // Not using TogglButton.updateCurrent as the time is not changed
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
          report(e);
        }
      },
      onError: function (xhr) {
        sendResponse(
          {
            success: false,
            type: "Update"
          }
        );
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

    TogglButton.updatePopup();
    if (!!TogglButton.pomodoroProgressTimer) {
      return;
    }
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
  },

  loginUser: function (request, sendResponse) {
    var error;
    TogglButton.ajax("/sessions", {
      method: 'POST',
      onLoad: function (xhr) {
        TogglButton.$sendResponse = sendResponse;
        if (xhr.status === 200) {
          TogglButton.queue.push(TogglButton.checkPermissions);
          TogglButton.fetchUser();
          TogglButton.refreshPage();
        } else {
          if (xhr.status === 403) {
            error = "Wrong Email or Password!";
          }
          sendResponse({success: false, error: error});
        }
      },
      onError: function (xhr) {
        sendResponse(
          {
            success: false,
            type: "login"
          }
        );
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
        TogglButton.updateTriggers(null);
        localStorage.setItem('userToken', null);
        sendResponse({success: (xhr.status === 200), xhr: xhr});
        if (xhr.status === 200) {
          TogglButton.setBrowserActionBadge();
        }
        TogglButton.refreshPageLogout();
      },
      onError: function (xhr) {
        sendResponse(
          {
            success: false,
            type: "logout"
          }
        );
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
    var html = '<p class="project-row" data-pid="0"><span class="project-bullet project-color no-color"></span>No project</p>',
      projects = TogglButton.$user.projectMap,
      clients =  TogglButton.$user.clientMap,
      clientNames = TogglButton.$user.clientNameMap,
      hideWs = (TogglButton.$user.workspaces.length > 1) ? "" : " hide",
      wsHtml = {},
      client,
      project,
      key = null,
      ckey = null,
      keys = [],
      clientName = 0,
      i;

    try {
      // Sort clients by name
      for (key in clientNames) {
        if (clientNames.hasOwnProperty(key)) {
          keys.push(key.toLowerCase());
        }
      }
      keys.sort();

      // Add Workspace list and names
      TogglButton.$user.workspaces.forEach(function (element, index) {
        wsHtml[element.id] = {};
        wsHtml[element.id][0] = '<ul class="ws-list" data-wid="' + element.id + '" title="' + escapeHtml(element.name) + '"><li class="ws-row' + hideWs + '" title="' + escapeHtml(element.name.toUpperCase()) + '">' + escapeHtml(element.name.toUpperCase()) + '</li>' +
          '<ul class="client-list" data-cid="0">';
      });

      // Add client list
      for (i = 0; i < keys.length; i++) {
        client = clientNames[keys[i]];
        wsHtml[client.wid][client.name + client.id] = '<ul class="client-list" data-cid="' + client.id + '"><li class="client-row" title="' + escapeHtml(client.name) + '">' + escapeHtml(client.name) + '</li>';
      }

      // Add projects
      for (key in projects) {
        if (projects.hasOwnProperty(key)) {
          project = projects[key];
          clientName = (!!project.cid && !!clients[project.cid]) ? (clients[project.cid].name + project.cid) : 0;
          wsHtml[project.wid][clientName] += TogglButton.generateProjectItem(project);
        }
      }

      // create html from array
      for (key in wsHtml) {
        if (wsHtml.hasOwnProperty(key)) {
          for (ckey in wsHtml[key]) {
            if (wsHtml[key].hasOwnProperty(ckey) && wsHtml[key][ckey].indexOf("project-row") !== -1) {
              html += wsHtml[key][ckey] + "</ul>";
            }
          }
          html += "</ul>";
        }
      }

    } catch (e) {
      report(e);
    }

    return html;
  },

  generateProjectItem: function (project) {
    var tasks = !!TogglButton.$user.projectTaskList ? TogglButton.$user.projectTaskList[project.id] : null,
      i,
      tasksCount,
      html = '<li class="project-row" title="' + escapeHtml(project.name) + '" data-pid="' + project.id + '"><span class="project-bullet project-color color-' + project.color + '"></span>' +
        '<span class="item-name">' + escapeHtml(project.name) + '</span>';

    if (!!tasks) {
      tasksCount = tasks.length + " task";
      if (tasks.length > 1) {
        tasksCount += "s";
      }
      html += '<span class="task-count">' + tasksCount + '</span>';
      html += '<ul class="task-list">';

      for (i = 0; i < tasks.length; i++) {
        html += '<li class="task-item" data-tid="' + tasks[i].id + '" title="' + escapeHtml(tasks[i].name) + '">' + escapeHtml(tasks[i].name) + '</li>';
      }

      html += '</ul>';
    }

    return html + '</li>';
  },

  fillTags: function () {
    var html = '<ul class="tag-list">',
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
      html += '<li class="tag-item" title="' + escapeHtml(tags[key].name) + '">' + escapeHtml(tags[key].name) + '</li>';
    }
    return html + "</ul>";
  },

  refreshPage: function () {
    var domain;
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      if (!!tabs[0]) {
        domain = TogglButton.extractDomain(tabs[0].url);
        if (!!domain.file) {
          chrome.tabs.reload(tabs[0].id);
        }
      }
    });
  },

  refreshPageLogout: function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      if (!!tabs[0]) {
        chrome.tabs.executeScript(tabs[0].id, {
          "code": "!!document.querySelector('.toggl-button')"
        }, function (reload) {
          if (!!reload[0]) {
            chrome.tabs.reload(tabs[0].id);
          }
        });
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

  toggleCheckingUserState: function (enable) {
    if (enable) {
      TogglButton.startCheckingUserState();
    } else {
      TogglButton.stopCheckingUserState();
    }
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

  startCheckingDayEnd: function (enable) {
    clearInterval(TogglButton.checkingWorkdayEnd);
    if (enable) {
      TogglButton.checkingWorkdayEnd = setInterval(TogglButton.checkWorkDayEnd, 30000);
    }
  },

  checkWorkDayEnd: function () {
    if (TogglButton.$user &&
        Db.get("stopAtDayEnd") &&
        TogglButton.$curEntry  &&
        TogglButton.workdayEnded()) {

      var title =  "Continue";
      if (!!TogglButton.$curEntry.description) {
        title += " (" + TogglButton.$curEntry.description + ")";
      } else {
        title += " latest";
      }

      TogglButton.stopTimeEntry(TogglButton.$curEntry);
      chrome.notifications.create(
        'workday-ended-notification',
        {
          type: 'basic',
          iconUrl: 'images/icon-128.png',
          title: "Toggl Button",
          message: "Your workday is over, running entry has been stopped",
          buttons: [
            { title: title }
          ]
        },
        function () {
          return;
        }
      );
    }
  },

  workdayEnded: function () {
    var startedTime = new Date(TogglButton.$curEntry.start),
      now = new Date(),
      endTime = new Date(),
      endTimeHelper = Db.get('dayEndTime').split(":");

    endTime.setHours(endTimeHelper[0]);
    endTime.setMinutes(endTimeHelper[1]);
    endTime.setSeconds(0);
    return (now >= endTime) && (endTime > startedTime);
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
    } else if (notificationId === 'workday-ended-notification') {
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
      }
      eventType = "workday-end";
    } else if (notificationId === 'pomodoro-time-is-up-dont-stop') {
      if (buttonID === 0) {
        TogglButton.stopTimeEntry(TogglButton.$curEntry);
      } else {
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
    TogglButton.createTimeEntry({"type": "timeEntry", "service": "contextMenu", "description": (info.selectionText || tab.title)}, null);
  },

  newMessage: function (request, sender, sendResponse) {
    var error;
    try {
      if (request.type === 'activate') {
        TogglButton.checkDailyUpdate();
        TogglButton.setBrowserActionBadge();
        sendResponse({success: TogglButton.$user !== null, user: TogglButton.$user, version: TogglButton.$fullVersion, defaults: { project: parseInt(Db.get("defaultProject"), 10) }});
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
      } else if (request.type === 'error') {
        // Handling integration errors
        error = new Error();
        error.stack = request.stack;
        error.message = request.stack.split("\n")[0];
        Bugsnag.notifyException(error, "Content Script Error [" + request.stack.split("content/")[1].split(".js")[0] + "]");
      } else if (request.type === 'options') {
        chrome.runtime.openOptionsPage();
      }

    } catch (e) {
      report(e);
    }

    return true;
  },

  tabUpdated: function (tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
      var domain = TogglButton.extractDomain(tab.url),
        permission = {origins: domain.origins};

      if (debug) {
        console.log("url: " + tab.url + " | domain-file: " + domain.file);
      }

      if (FF) {
        if (!!domain.file) {
          TogglButton.checkLoadedScripts(tabId, domain.file);
        }
      } else {
        chrome.permissions.contains(permission, function (result) {
          if (result && !!domain.file) {
            TogglButton.checkLoadedScripts(tabId, domain.file);
          }
        });
      }
    }
  },

  checkLoadedScripts: function (tabId, file) {
    chrome.tabs.executeScript(tabId, {
      "code": "(typeof togglbutton === 'undefined')"
    }, function (firstLoad) {
      if (!!firstLoad[0]) {
        TogglButton.loadFiles(tabId, file);
      }
    });
  },

  loadFiles: function (tabId, file) {
    if (debug) {
      console.log("Load content script: [" + file + "]");
    }
    chrome.tabs.insertCSS(tabId, {file: "styles/style.css"}, function () {
      chrome.tabs.insertCSS(tabId, {file: "styles/autocomplete.css"});
    });

    chrome.tabs.executeScript(tabId, {file: "scripts/autocomplete.js"}, function () {
      chrome.tabs.executeScript(tabId, {file: "scripts/common.js"}, function () {
        chrome.tabs.executeScript(tabId, {file: "scripts/content/" + file});
      });
    });
  },

  extractDomain: function (url) {
    var domain, file;

    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
      domain = url.split('/')[2];
    } else {
      domain = url.split('/')[0];
    }

    //remove www if needed
    domain = domain.replace("www.", "");

    //remove /* from the end
    domain = domain.split('/*')[0];

    //find & remove port number
    domain = domain.split(':')[0];

    file = Db.getOriginFileName(domain);

    //console.log("URL: " + url + " | Domain: " + domain);

    return {
      file: file,
      origins: [
        "*://" + domain + "/*"
      ]
    };
  },

  toggleRightClickButton: function (show) {
    if (show) {
      chrome.contextMenus.create({"title": "Start timer", "contexts": ["page"], "onclick": TogglButton.contextMenuClick});
      chrome.contextMenus.create({"title": "Start timer with description '%s'", "contexts": ["selection"], "onclick": TogglButton.contextMenuClick});
    } else {
      chrome.contextMenus.removeAll();
    }
  },

  startAutomatically: function () {
    if (!TogglButton.$curEntry && Db.get("startAutomatically") && !!TogglButton.$user) {
      var lastEntryString, lastEntry;
      lastEntryString = Db.get("latestStoppedEntry");
      if (lastEntryString) {
        lastEntry = JSON.parse(lastEntryString);
        TogglButton.$latestStoppedEntry = lastEntry;
        TogglButton.createTimeEntry(TogglButton.$latestStoppedEntry, null);
        TogglButton.hideNotification('remind-to-track-time');
      }
    }
  },

  stopTrackingOnBrowserClosed: function () {
    openWindowsCount--;
    if (Db.get("stopAutomatically") && openWindowsCount === 0 && TogglButton.$curEntry) {
      TogglButton.stopTimeEntry(TogglButton.$curEntry);
    }
  },

  checkPermissions: function (show) {
    if (!Db.get("dont-show-permissions") && !FF) {
      chrome.permissions.getAll(function (results) {
        if (!!show || results.origins.length === 2) {
          show = show || 3;
          Db.set("selected-settings-tab", 3);
          Db.set("show-permissions-info", show);
          chrome.runtime.openOptionsPage();
        }
      });
    }
  }

};

TogglButton.queue.push(TogglButton.startAutomatically);
TogglButton.toggleRightClickButton(Db.get("showRightClickButton"));
TogglButton.fetchUser();
TogglButton.triggerNotification();
TogglButton.startCheckingUserState();
chrome.tabs.onUpdated.addListener(TogglButton.tabUpdated);
chrome.alarms.onAlarm.addListener(TogglButton.pomodoroAlarmStop);
TogglButton.startCheckingDayEnd(Db.get("stopAtDayEnd"));
chrome.runtime.onMessage.addListener(TogglButton.newMessage);
chrome.notifications.onClosed.addListener(TogglButton.processNotificationEvent);
chrome.notifications.onClicked.addListener(TogglButton.processNotificationEvent);
chrome.notifications.onButtonClicked.addListener(TogglButton.notificationBtnClick);
chrome.windows.onCreated.addListener(TogglButton.startAutomatically);
chrome.windows.getAll(null, function (windows) { openWindowsCount = windows.length; });
chrome.windows.onCreated.addListener(function (window) { openWindowsCount++; });
chrome.windows.onRemoved.addListener(TogglButton.stopTrackingOnBrowserClosed);
window.onbeforeunload = function () {
  if (Db.get("stopAutomatically") && TogglButton.$curEntry) {
    TogglButton.stopTimeEntry(TogglButton.$curEntry);
  }
};

if (!FF) {
  TogglButton.checkPermissions();

  // Check whether new version is installed
  chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
      TogglButton.checkPermissions(1);
    } else if (details.reason === "update") {
      if (details.previousVersion[0] === "0" && chrome.runtime.getManifest().version[0] === "1") {
        TogglButton.checkPermissions(2);
      }
    }
  });
}

