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
  $websites: null,
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
  $defaultWebsites: [{
      'url': 'web.any.do',
      'app': 'AnyDo'
    }, {
      'url': 'asana.com',
      'app': 'Asana'
    }, {
      'url': 'basecamp.com',
      'app': 'Basecamp'
    }, {
      'url': 'bitbucket.org',
      'app': 'Bitbucket'
    }, {
      'url': 'capsulecrm.com',
      'app': 'Capsule'
    }, {
      'url': 'github.com',
      'app': 'GitHub'
    }, {
      'url': 'gitlab.com',
      'app': 'GitLab'
    }, {
      'url': 'docs.google.com',
      'app': 'GoogleDrive'
    }, {
      'url': 'drive.google.com',
      'app': 'GoogleDrive'
    }, {
      'url': 'pivotaltracker.com',
      'app': 'PivotalTracker'
    }, {
      'url': 'podio.com',
      'app': 'Podio'
    }, {
      'url': 'producteev.com',
      'app': 'Producteev'
    }, {
      'url': 'redbooth.com',
      'app': 'Redbooth'
    }, {
      'url': 'redmine.org',
      'app': 'Redmine'
    }, {
      'url': 'sifterapp.com',
      'app': 'Sifter'
    }, {
      'url': 'teamweek.com',
      'app': 'Teamweek'
    }, {
      'url': 'todoist.com',
      'app': 'Todoist'
    }, {
      'url': 'bugs.jquery.com',
      'app': 'Trac'
    }, {
      'url': 'trac-hacks.org',
      'app': 'Trac'
    }, {
      'url': 'trac.edgewall.org',
      'app': 'Trac'
    }, {
      'url': 'trac.wordpress.org',
      'app': 'Trac'
    }, {
      'url': 'trello.com',
      'app': 'Trello'
    }, {
      'url': 'unfuddle.com',
      'app': 'Unfuddle'
    }, {
      'url': 'worksection.com',
      'app': 'Worksection'
    }, {
      'url': 'myjetbrains.com',
      'app': 'YouTrack'
    }, {
      'url': 'zendesk.com',
      'app': 'Zendesk'
    }],

  checkUrl: function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      if (/toggl\.com\/track/.test(tab.url)) {
        TogglButton.fetchUser(TogglButton.$apiUrl);
      } else if (/toggl\.com\/app\/index/.test(tab.url)) {
        TogglButton.fetchUser(TogglButton.$newApiUrl);
      } else {
        var websites = JSON.parse(localStorage.getItem('websites'));
        for (var i = 0; i < websites.length; i++) {
          var curURL = websites[i]['url'];
          var curApp = websites[i]['app'];
          if (curURL && tab.url.indexOf(curURL) > -1) {
            switch (curApp) {
              case "Asana":
                chrome.tabs.executeScript({file: 'scripts/content/asana.js'});
                break;
              case "Podio":
                chrome.tabs.executeScript({file: 'scripts/content/podio.js'});
                break;
              case "Trello":
                chrome.tabs.executeScript({file: 'scripts/content/trello.js'});
                break;
              case "GitHub":
                chrome.tabs.executeScript({file: 'scripts/content/github.js'});
                break;
              case "Bitbucket":
                chrome.tabs.executeScript({file: 'scripts/content/bitbucket.js'});
                break;
              case "GitLab":
                chrome.tabs.executeScript({file: 'scripts/content/gitlab.js'});
                break;
              case "Redbooth":
                chrome.tabs.executeScript({file: 'scripts/content/redbooth.js'});
                break;
              case "Teamweek":
                chrome.tabs.executeScript({file: 'scripts/content/teamweek.js'});
                break;
              case "Basecamp":
                chrome.tabs.executeScript({file: 'scripts/content/basecamp.js'});
                break;
              case "Unfuddle":
                chrome.tabs.executeScript({file: 'scripts/content/unfuddle.js'});
                break;
              case "Worksection":
                chrome.tabs.executeScript({file: 'scripts/content/worksection.js'});
                break;
              case "PivotalTracker":
                chrome.tabs.executeScript({file: 'scripts/content/pivotal.js'});
                break;
              case "Producteev":
                chrome.tabs.executeScript({file: 'scripts/content/producteev.js'});
                break;
              case "Sifter":
                chrome.tabs.executeScript({file: 'scripts/content/sifterapp.js'});
                break;
              case "GoogleDrive":
                chrome.tabs.executeScript({file: 'scripts/content/google-docs.js'});
                break;
              case "Redmine":
                chrome.tabs.executeScript({file: 'scripts/content/redmine.js'});
                break;
              case "YouTrack":
                chrome.tabs.executeScript({file: 'scripts/content/youtrack.js'});
                break;
              case "Zendesk":
                chrome.tabs.executeScript({file: 'scripts/content/zendesk.js'});
                break;
              case "Capsule":
                chrome.tabs.executeScript({file: 'scripts/content/capsule.js'});
                break;
              case "AnyDo":
                chrome.tabs.executeScript({file: 'scripts/content/anydo.js'});
                break;
              case "Todoist":
                chrome.tabs.executeScript({file: 'scripts/content/todoist.js'});
                break;
              case "Trac":
                chrome.tabs.executeScript({file: 'scripts/content/trac.js'});
                break;
              default:
                console.log('Invalid app name: ' + curApp);
            }
          }
        }
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
      TogglButton.setBrowserAction(entry);
    } else if (data.action === "UPDATE") {
      if (entry.duration >= 0) {
        entry = null;
      }
      TogglButton.$curEntry = entry;
      TogglButton.setBrowserAction(entry);
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
  
  setWebsites: function (websites) {
    localStorage.setItem('websites', JSON.stringify(websites));
    TogglButton.$websites = websites;
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
    } else if (request.type === 'setWebsite') {
      var websites = TogglButton.$websites.slice();
      websites[request.index] = request.value;
      TogglButton.setWebsites(websites);
    } else if (request.type === 'removeWebsite') {
      var websites = TogglButton.$websites.slice();
      websites.splice(request.index, 1);
      TogglButton.setWebsites(websites);
    } else if (request.type === 'restoreDefaultWebsites') {
      TogglButton.setWebsites(TogglButton.$defaultWebsites.slice());
      sendResponse();
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
