/*jslint indent: 2, unparam: true*/
/*global window: false, XMLHttpRequest: false, WebSocket: false, chrome: false, btoa: false, localStorage:false */
"use strict";

var TogglButton = {
  $user: null,
  $curEntry: null,
  $showPostPopup: true,
  $apiUrl: "https://old.toggl.com/api/v7",
  $newApiUrl: "https://www.toggl.com/api/v8",
  $sendResponse: null,
  $socket: null,
  $retrySocket: false,
  $socketEnabled: false,
  $editForm: '<div id="toggl-button-edit-form">' +
      '<a class="toggl-button {service} active" href="#">Stop timer</a>' +
      '<p class="toggl-button-row">' +
        '<label for="toggl-button-description">Description:</label>' +
        '<input name="toggl-button-description" type="text" id="toggl-button-description" class="toggl-button-input" value="">' +
      '</p>' +
      '<p class="toggl-button-row">' +
        '<label for="toggl-button-project">Project:</label>' +
        '<select class="toggl-button-input" id="toggl-button-project" name="toggl-button-project">{projects}</select>' +
      '</p>' +
      '<p id="toggl-button-submit-row">' +
        '<input type="button" value="Cancel" id="toggl-button-hide">' +
        '<input type="button" value="Update" id="toggl-button-update">' +
      '</p>' +
    '</div>',

  checkUrl: function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      if (/toggl\.com\/track/.test(tab.url)) {
        TogglButton.fetchUser(TogglButton.$apiUrl);
      } else if (/toggl\.com\/app\/index/.test(tab.url)) {
        TogglButton.fetchUser(TogglButton.$newApiUrl);
      }
    }
  },

  fetchUser: function (apiUrl, token) {
    TogglButton.ajax('/me?with_related_data=true', {
      token: token || ' ',
      baseUrl: apiUrl,
      onLoad: function (xhr) {
        var resp, apiToken, projectMap = {};
        if (xhr.status === 200) {
          resp = JSON.parse(xhr.responseText);
          if (resp.data.projects) {
            resp.data.projects.forEach(function (project) {
              projectMap[project.name] = project;
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
        } else if (apiUrl === TogglButton.$apiUrl) {
          TogglButton.fetchUser(TogglButton.$newApiUrl);
        } else if (apiUrl === TogglButton.$newApiUrl && !token) {
          apiToken = localStorage.getItem('userToken');
          if (apiToken) {
            TogglButton.fetchUser(TogglButton.$newApiUrl, apiToken);
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
      if (data.session_id !== null) {
        console.log("session authenticated, session ID:", data.session_id);
      } else if (data.model !== null) {
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
    } else if (data.action === "UPDATE") {
      if (entry.duration < 0) {
        TogglButton.$curEntry = entry;
      } else {
        TogglButton.$curEntry = null;
      }
    }
  },

  createTimeEntry: function (timeEntry, sendResponse) {
    var project, start = new Date(),
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
          sendResponse({success: (xhr.status === 200), type: "New Entry", entry: entry, showPostPopup: TogglButton.$showPostPopup});
        }
      }
    });
  },

  ajax: function (url, opts) {
    var xhr = new XMLHttpRequest(),
      method = opts.method || 'GET',
      baseUrl = opts.baseUrl || TogglButton.$newApiUrl,
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
          TogglButton.$curEntry = null;
          TogglButton.setBrowserAction(null);
          if (!!timeEntry.respond) {
            sendResponse({success: true, type: "Stop"});
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {type: "stop-entry"});
            });
          }
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
          pid: timeEntry.pid
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
      title = runningEntry.description + " - Toggl";
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
        TogglButton.fetchUser(TogglButton.$newApiUrl);
        TogglButton.refreshPage();
      },
      credentials: {
        username: request.username,
        password: request.password
      }
    });
  },

  logoutUser: function (sendResponse) {
    TogglButton.ajax("/sessions?created_with=TogglButton", {
      method: 'DELETE',
      onLoad: function (xhr) {
        TogglButton.$user = null;
        sendResponse({success: (xhr.status === 200), xhr: xhr});
        TogglButton.refreshPage();
      }
    });
  },

  getEditForm: function () {
    if (TogglButton.$user === null) {
      return "";
    }
    return TogglButton.$editForm.replace("{projects}", TogglButton.fillProjects());
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

  newMessage: function (request, sender, sendResponse) {
    if (request.type === 'activate') {
      TogglButton.setBrowserActionBadge();
      sendResponse({success: TogglButton.$user !== null, user: TogglButton.$user, html: TogglButton.getEditForm()});
    } else if (request.type === 'login') {
      TogglButton.loginUser(request, sendResponse);
    } else if (request.type === 'logout') {
      TogglButton.logoutUser(sendResponse);
    } else if (request.type === 'timeEntry') {
      TogglButton.createTimeEntry(request, sendResponse);
    } else if (request.type === 'update') {
      TogglButton.updateTimeEntry(request, sendResponse);
    } else if (request.type === 'stop') {
      TogglButton.stopTimeEntry(request, sendResponse);
    } else if (request.type === 'toggle-popup') {
      localStorage.setItem("showPostPopup", request.state);
      TogglButton.$showPostPopup = request.state;
    } else if (request.type === 'toggle-socket') {
      TogglButton.setSocket(request.state);
    } else if (request.type === 'userToken') {
      if (!TogglButton.$user) {
        TogglButton.fetchUser(TogglButton.$newApiUrl, request.apiToken);
      }
    } else if (request.type === 'currentEntry') {
      sendResponse({success: TogglButton.$curEntry !== null, currentEntry: TogglButton.$curEntry});
    }
    return true;
  }
};

TogglButton.fetchUser(TogglButton.$apiUrl);
TogglButton.$showPostPopup = (localStorage.getItem("showPostPopup") === null) ? true : localStorage.getItem("showPostPopup");
TogglButton.$socketEnabled = !!localStorage.getItem("socketEnabled");
chrome.tabs.onUpdated.addListener(TogglButton.checkUrl);
chrome.extension.onMessage.addListener(TogglButton.newMessage);
