import bugsnagClient from './lib/bugsnag';
import { escapeHtml, isTogglURL, report, secToHHMM } from './lib/utils';

import Db from './lib/db';
import Ga from './lib/ga';

const browser = require('webextension-polyfill');

let openWindowsCount = 0;

const FF = navigator.userAgent.indexOf('Chrome') === -1;

function filterTabs (handler) {
  return function (tabs) {
    try {
      if (
        Array.isArray(tabs) &&
        tabs.length &&
        tabs[0].url.match('https?://')
      ) {
        return handler(tabs);
      }
    } catch (e) {
      report(e);
    }
  };
}

window.TogglButton = {
  $user: null,
  $curEntry: null,
  $latestStoppedEntry: null,
  $ApiUrl: process.env.API_URL,
  $ApiV8Url: `${process.env.API_URL}/v8`,
  $ApiV9Url: `${process.env.API_URL}/v9`,
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
  localEntry: null,
  $userState: 'active',
  $fullVersion: `TogglButton/${process.env.VERSION}`,
  $version: process.env.VERSION,
  queue: [],
  $editForm:
    '<div id="toggl-button-edit-form">' +
    '<form autocomplete="off">' +
    '<a class="toggl-button toggl-button-edit-form-button {service} active" href="javascript:void(0)">Stop timer</a>' +
    '<a id="toggl-button-hide">&times;</a>' +
    '<div class="toggl-button-row" id="toggl-button-duration-row">' +
    '<input name="toggl-button-duration" tabindex="100" type="text" pattern="[\\d]{2}:[\\d]{2}:[\\d]{2}" title="Please write the duration in the \'hh:mm:ss\' format." id="toggl-button-duration" class="toggl-button-input" value="" placeholder="00:00" autocomplete="off">' +
    '</div>' +
    '<div class="toggl-button-row">' +
    '<input name="toggl-button-description" tabindex="101" type="text" id="toggl-button-description" class="toggl-button-input" value="" placeholder="(no description)" autocomplete="off">' +
    '</div>' +
    '<div class="toggl-button-row">' +
    '<input name="toggl-button-project-filter" tabindex="102" type="text" id="toggl-button-project-filter" class="toggl-button-input" value="" placeholder="Filter Projects" autocomplete="off">' +
    '<a href="javascript:void(0)" class="filter-clear">&times;</a>' +
    '<div id="toggl-button-project-placeholder" class="toggl-button-input" disabled><span class="tb-project-bullet"></span><div class="toggl-button-text">Add project</div><span>▼</span></div>' +
    '<div id="project-autocomplete">{projects}</div>' +
    '</div>' +
    '<div class="toggl-button-row">' +
    '<input name="toggl-button-tag-filter" tabindex="103" type="text" id="toggl-button-tag-filter" class="toggl-button-input" value="" placeholder="Filter Tags" autocomplete="off">' +
    '<a href="javascript:void(0)" class="add-new-tag">+ Add</a>' +
    '<a href="javascript:void(0)" class="filter-clear">&times;</a>' +
    '<div id="toggl-button-tag-placeholder" class="toggl-button-input" disabled><div class="toggl-button-text">Add tags</div><span>▼</span></div>' +
    '<div id="tag-autocomplete">' +
    '<div class="tag-clear">Clear selected tags</div>' +
    '{tags}</div>' +
    '</div>' +
    '<div class="toggl-button-row tb-billable {billable}" tabindex="103">' +
    '<div class="toggl-button-billable-label">Billable</div>' +
    '<div class="toggl-button-billable-flag"><span></span></div>' +
    '</div>' +
    '<div id="toggl-button-update" tabindex="105">DONE</div>' +
    '<input type="submit" class="hidden">' +
    '</from>' +
    '</div>',

  fetchUser: function (token) {
    bugsnagClient.leaveBreadcrumb('Fetching user with related data');
    return new Promise((resolve, reject) => {
      TogglButton.ajax('/me?with_related_data=true', {
        token: token,
        baseUrl: TogglButton.$ApiV8Url,
        onLoad: function (xhr) {
          let resp;
          const projectMap = {};
          const clientMap = {};
          const clientNameMap = {};
          const tagMap = {};
          let projectTaskList = null;
          let entry = null;

          try {
            if (xhr.status === 200) {
              browser.tabs.query({ active: true, currentWindow: true })
                .then(filterTabs(function (tabs) {
                  browser.tabs.sendMessage(tabs[0].id, { type: 'sync' });
                }));
              resp = JSON.parse(xhr.responseText);
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
                  clientNameMap[client.name.toLowerCase() + client.id] = client;
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
                  const pid = task.pid;
                  if (!projectTaskList[pid]) {
                    projectTaskList[pid] = [];
                  }
                  projectTaskList[pid].push(task);
                });
              }
              if (resp.data.time_entries) {
                const { time_entries: timeEntries } = resp.data;
                entry = timeEntries.find(te => te.duration < 0) || null;
              }

              if (TogglButton.hasWorkspaceBeenRevoked(resp.data.workspaces)) {
                TogglButton.showRevokedWSView();
              }

              TogglButton.updateTriggers(entry);
              localStorage.setItem('projects', JSON.stringify(projectMap));
              localStorage.setItem('clients', JSON.stringify(clientMap));
              TogglButton.$user = resp.data;
              TogglButton.$user.time_entries = TogglButton.$user.time_entries.map((te) => {
                // Ensure empty values from v8 become null.
                return {
                  ...te,
                  pid: te.pid || null,
                  tid: te.tid || null
                };
              });
              TogglButton.$user.projectMap = projectMap;
              TogglButton.$user.clientMap = clientMap;
              TogglButton.$user.clientNameMap = clientNameMap;
              TogglButton.$user.tagMap = tagMap;
              TogglButton.$user.projectTaskList = projectTaskList;
              if (!TogglButton.$user.default_wid) {
                const defaultWS = TogglButton.$user.workspaces[0];
                TogglButton.$user.default_wid = defaultWS.id;
              }
              localStorage.setItem('userToken', resp.data.api_token);
              resolve({ success: xhr.status === 200 });
              TogglButton.setBrowserActionBadge();
              TogglButton.setupSocket();
              TogglButton.updateBugsnag();
              TogglButton.handleQueue();
              TogglButton.setCanSeeBillable();
              ga.reportOs();
            } else {
              bugsnagClient.notify(new Error(`Fetch user failed ${xhr.status}`), {
                metaData: {
                  status: xhr.status,
                  responseText: xhr.responseText
                }
              });
              TogglButton.setBrowserActionBadge();
              resolve({
                success: false,
                type: 'login',
                error: `Fetch user failed ${xhr.status}`
              });
            }
          } catch (e) {
            report(e);
          }
        },
        onError: function (xhr) {
          TogglButton.setBrowserActionBadge();
          resolve({
            success: false,
            type: 'login',
            error: 'Connectivity error'
          });
        }
      });
    });
  },

  handleQueue: function () {
    while (TogglButton.queue.length) {
      TogglButton.queue.shift()();
    }
  },

  updateBugsnag: function () {
    // Set user data
    bugsnagClient.user = {
      id: TogglButton.$user.id
    };
  },

  setCanSeeBillable: function () {
    let canSeeBillable = false;
    let ws;
    let k;
    for (k in TogglButton.$user.workspaces) {
      if (TogglButton.$user.workspaces.hasOwnProperty(k)) {
        ws = TogglButton.$user.workspaces[k];
        if (ws.premium) {
          canSeeBillable = true;
          break;
        }
      }
    }
    TogglButton.canSeeBillable = canSeeBillable;
  },

  setupSocket: function () {
    if (TogglButton.$socket && !TogglButton.$retrySocket) {
      return;
    }

    try {
      TogglButton.$socket = new WebSocket('wss://stream.toggl.com/ws');
    } catch (e) {
      return;
    }

    const authenticationMessage = {
      type: 'authenticate',
      api_token: TogglButton.$user.api_token
    };
    const pingResponse = JSON.stringify({
      type: 'pong'
    });

    TogglButton.$socket.onopen = function () {
      const data = JSON.stringify(authenticationMessage);
      try {
        return TogglButton.$socket.send(data);
      } catch (error) {
        console.log('Exception while sending:', error);
      }
    };

    TogglButton.$socket.onerror = function (e) {
      return console.log('onerror: ', e);
    };

    TogglButton.$socket.onclose = function () {
      const retrySeconds = Math.floor(Math.random() * 30);
      if (TogglButton.$retrySocket) {
        setTimeout(TogglButton.setupSocket, retrySeconds * 1000);
        TogglButton.$retrySocket = false;
      }
    };

    TogglButton.$socket.onmessage = function (msg) {
      // test for empty json
      if (!msg.data) {
        return;
      }
      const data = JSON.parse(msg.data);
      if (data.model !== null) {
        if (data.model === 'time_entry') {
          TogglButton.updateCurrentEntry(data);
        }
      } else if (TogglButton.$socket !== null) {
        try {
          TogglButton.$socket.send(pingResponse);
        } catch (error) {
          console.log('Exception while sending:', error);
        }
      }
    };
  },

  updateTriggers: function (entry) {
    const update =
      !!TogglButton.localEntry &&
      !!entry &&
      TogglButton.localEntry.id === entry.id;

    TogglButton.$curEntry = entry;
    if (entry) {
      if (update) {
        TogglButton.checkPomodoroAlarm(entry);
        clearTimeout(TogglButton.$nannyTimer);
        TogglButton.$nannyTimer = null;
      } else {
        browser.browserAction.setIcon({
          path: { '19': 'images/active-19.png', '38': 'images/active-38.png' }
        });
      }
    } else {
      // Clear pomodoro timer
      clearTimeout(TogglButton.pomodoroAlarm);
      TogglButton.pomodoroAlarm = null;
      clearInterval(TogglButton.pomodoroProgressTimer);
      TogglButton.pomodoroProgressTimer = null;
      browser.browserAction.setIcon({
        path: { '19': 'images/inactive-19.png', '38': 'images/inactive-38.png' }
      });
    }
    // Toggle workday end check
    TogglButton.startCheckingDayEnd(!!entry);

    TogglButton.toggleCheckingUserState(!!entry);
    TogglButton.setBrowserAction(entry);
  },

  updateCurrentEntry: async function (data) {
    let entry = data.data;
    const rememberProjectPer = await db.get('rememberProjectPer');
    /**
     * setDefaultProject parameters are (pid, scope). So the logic goes:
     * If we wan't to remember the project specifically for a given scope (from settings),
     * - If the pid is the same as the default global project, then we set it to null
     * -- Disabling a specific default for this scope, henceforth taking whatever global default gives us
     * -- (I think it works best this way. Could be wrong)
     * - Now, for the scope: If we want to remember per service, then we use current service string
     * -- Otherwise, we use the current url for scope.
     * We never use scope=null, so we never touch the global default.
     */
    if (rememberProjectPer) {
      const defaultProject = await db.getDefaultProject();
      const projectIsSameAsGlobalDefault = entry.pid === defaultProject;

      if (projectIsSameAsGlobalDefault) {
        if (defaultProject !== null) {
          db.setDefaultProject(
            null,
            rememberProjectPer === 'service'
              ? TogglButton.$curService
              : TogglButton.$curURL
          );
        }
      } else {
        if (entry.pid !== defaultProject) {
          db.setDefaultProject(
            entry.pid,
            rememberProjectPer === 'service'
              ? TogglButton.$curService
              : TogglButton.$curURL
          );
        }
      }
    }

    if (data.action === 'INSERT') {
      TogglButton.updateTriggers(entry);
    } else if (
      data.action === 'UPDATE' &&
      (TogglButton.$curEntry === null || entry.id === TogglButton.$curEntry.id)
    ) {
      if (entry.duration >= 0) {
        TogglButton.$latestStoppedEntry = entry;
        TogglButton.updateEntriesDb();
        entry = null;
      }
      TogglButton.updateTriggers(entry);
    } else if (data.action === 'delete') {
      if (
        TogglButton.$curEntry !== null &&
        TogglButton.$curEntry.id === entry.id
      ) {
        TogglButton.$latestStoppedEntry = entry;
        TogglButton.updateTriggers(null);
      }
    }
  },

  updateEntriesDb: function () {
    let added = false;
    let index;
    let entry;

    if (!TogglButton.$user) {
      TogglButton.fetchUser();
      return;
    }

    if (TogglButton.$latestStoppedEntry) {
      TogglButton.$latestStoppedEntry.pid = TogglButton.$latestStoppedEntry.pid || TogglButton.$latestStoppedEntry.project_id || null;
      TogglButton.$latestStoppedEntry.tid = TogglButton.$latestStoppedEntry.tid || TogglButton.$latestStoppedEntry.task_id || null;
    }

    if (
      !TogglButton.$user.time_entries ||
      !Object.keys(TogglButton.$user.time_entries).length
    ) {
      TogglButton.$user.time_entries = [];
    } else {
      for (index in TogglButton.$user.time_entries) {
        if (TogglButton.$user.time_entries.hasOwnProperty(index)) {
          entry = TogglButton.$user.time_entries[index];
          if (entry.id === TogglButton.$latestStoppedEntry.id) {
            TogglButton.$user.time_entries[index] =
              TogglButton.$latestStoppedEntry;
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

  findProjectByName: function (nameOrNames) {
    let key;
    let name;
    const names = [].concat(nameOrNames);
    let result;
    let i;

    for (i = 0; i < names.length; i++) {
      name = names[i];
      for (key in TogglButton.$user.projectMap) {
        if (
          TogglButton.$user.projectMap.hasOwnProperty(key) &&
          TogglButton.$user.projectMap[key].name === name
        ) {
          result = TogglButton.$user.projectMap[key];
          if (result.wid === TogglButton.$user.default_wid) {
            return result;
          }
        }
      }
    }
    return result;
  },

  findProjectByPid: function (pid) {
    let key;
    for (key in TogglButton.$user.projectMap) {
      if (
        TogglButton.$user.projectMap.hasOwnProperty(key) &&
        TogglButton.$user.projectMap[key].id === pid
      ) {
        return TogglButton.$user.projectMap[key];
      }
    }
    return undefined;
  },

  createTimeEntry: async function (timeEntry) {
    const type = timeEntry.type;
    const start = new Date();
    let defaultProject;
    const rememberProjectPer = await db.get('rememberProjectPer');
    const enableAutoTagging = await db.get('enableAutoTagging');
    let entry;
    let error = '';
    let project;

    TogglButton.$curService = (timeEntry || {}).service;
    TogglButton.$curURL = (timeEntry || {}).url;

    if (rememberProjectPer) {
      defaultProject = await db.getDefaultProject(
        rememberProjectPer === 'service'
          ? TogglButton.$curService
          : TogglButton.$curURL
      );
    } else {
      defaultProject = await db.getDefaultProject();
    }

    if (!timeEntry) {
      return new Promise((resolve) => {
        resolve({
          success: false,
          type: 'New Entry'
        });
      });
    }
    const shouldIncludeTags = (enableAutoTagging || type === 'list-continue' || type === 'resume');

    entry = {
      start: start.toISOString(),
      stop: null,
      duration: -parseInt(start.getTime() / 1000, 10),
      description: timeEntry.description || '',
      pid: timeEntry.pid || timeEntry.projectId || null,
      tid: timeEntry.tid || null,
      wid: timeEntry.wid || TogglButton.$user.default_wid,
      tags: shouldIncludeTags ? (timeEntry.tags || null) : null,
      billable: timeEntry.billable || false,
      created_with: timeEntry.createdWith || TogglButton.$fullVersion
    };

    if (timeEntry.projectName !== null && !entry.pid) {
      project = TogglButton.findProjectByName(timeEntry.projectName);
      entry.pid = (project && project.id) || null;
      entry.billable = project && project.billable;
      entry.wid = (project && project.wid) || entry.wid;
    }

    // set Default project if needed
    if (!entry.pid && !!defaultProject) {
      project = TogglButton.findProjectByPid(defaultProject);
      entry.pid = (project && project.id) || null;
      entry.billable = project && project.billable;
      entry.wid = (project && project.wid) || entry.wid;
    }

    return new Promise((resolve) => {
      TogglButton.ajax('/time_entries', {
        method: 'POST',
        payload: entry,
        baseUrl: TogglButton.$ApiV9Url,
        onLoad: async function (xhr) {
          const hasTasks =
            !!TogglButton.$user && !!TogglButton.$user.projectTaskList;

          const success = xhr.status === 200;
          try {
            if (success) {
              entry = JSON.parse(xhr.responseText);
              TogglButton.localEntry = entry;
              TogglButton.updateTriggers(entry);
              ga.reportEvent(timeEntry.type, timeEntry.service);
            } else {
              error = xhr.responseText;
            }

            if (timeEntry.respond) {
              const showPostPopup = await db.get('showPostPopup');
              resolve({
                success: success,
                type: 'New Entry',
                entry: entry,
                showPostPopup: showPostPopup,
                html: TogglButton.getEditForm(),
                hasTasks: hasTasks,
                error: error
              });
            } else {
              resolve({
                success: true
              });
            }
          } catch (e) {
            report(e);
          }
        },
        onError: function (xhr) {
          resolve({
            success: false,
            type: 'New Entry'
          });
        }
      });
    });
  },

  latestEntry: function () {
    const timeEntries = TogglButton.$user.time_entries || [ null ];
    return timeEntries[timeEntries.length - 1];
  },

  checkPomodoroAlarm: async function (entry) {
    const duration = new Date() - new Date(entry.start);
    const pomodoroInterval = await db.get('pomodoroInterval');
    const interval = parseInt(pomodoroInterval, 10) * 60000;
    if (duration < interval) {
      TogglButton.triggerPomodoroAlarm(interval - duration);
    }
  },

  triggerPomodoroAlarm: async function (value) {
    if (TogglButton.pomodoroAlarm !== null) {
      clearTimeout(TogglButton.pomodoroAlarm);
      TogglButton.pomodoroAlarm = null;
      clearInterval(TogglButton.pomodoroProgressTimer);
    }
    const pomodoroModeEnabled = await db.get('pomodoroModeEnabled');
    if (pomodoroModeEnabled) {
      const intervalSetting = await db.get('pomodoroInterval');
      const pomodoroInterval = parseInt(intervalSetting, 10) * 60000;
      const interval = value || pomodoroInterval;
      const steps = 120;
      const elapsedTime = (pomodoroInterval - interval) / pomodoroInterval;
      const updateProgress = TogglButton.updatePomodoroProgress(
        interval,
        steps,
        elapsedTime
      );
      TogglButton.pomodoroAlarm = setTimeout(
        TogglButton.pomodoroAlarmStop,
        interval
      );
      TogglButton.pomodoroProgressTimer = setInterval(
        updateProgress,
        pomodoroInterval / steps
      );
      updateProgress();
    }
  },

  updatePomodoroProgress: function (interval, steps, elapsedTime) {
    let current = 0;
    let intervalCount = 0;
    return async function () {
      let key;
      let img;
      const imagePaths = {
        '19': 'images/active-19.png',
        '38': 'images/active-38.png'
      };
      const imageData = {};
      const circ = Math.PI * 2;
      const quart = Math.PI * 0.5;
      let imageLoadedCount = 0;

      const imageLoaded = function (key) {
        return function () {
          const canvas = document.createElement('canvas');

          const ctx = canvas.getContext('2d');
          ctx.drawImage(this, 0, 0);
          ctx.beginPath();
          ctx.strokeStyle = '#ffffff';
          ctx.lineCap = 'butt';
          ctx.closePath();
          ctx.fill();
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(
            this.naturalWidth * 0.5,
            this.naturalHeight * 0.5,
            this.naturalWidth * 0.5 - 1,
            quart * -1,
            circ * current - quart,
            false
          );
          ctx.stroke();
          imageData[key] = ctx.getImageData(
            0,
            0,
            this.naturalWidth,
            this.naturalHeight
          );
          ++imageLoadedCount;
          if (imageLoadedCount === 2) {
            browser.browserAction.setIcon({
              imageData: imageData
            });
          }
        };
      };
      intervalCount += interval / steps;
      current = intervalCount / interval + elapsedTime;

      const pomodoroModeEnabled = await db.get('pomodoroModeEnabled');
      if (pomodoroModeEnabled) {
        for (key in imagePaths) {
          if (imagePaths.hasOwnProperty(key)) {
            img = new Image();
            img.onload = imageLoaded(key);
            img.src = imagePaths[key];
          }
        }
      } else {
        clearInterval(TogglButton.pomodoroProgressTimer);
        browser.browserAction.setIcon({
          path: imagePaths
        });
      }
    };
  },

  ajax: function (url, opts) {
    const xhr = new XMLHttpRequest();
    const method = opts.method || 'GET';
    const baseUrl = opts.baseUrl || TogglButton.$ApiV8Url;
    const resolvedUrl = baseUrl + url;
    const token =
        opts.token ||
        (TogglButton.$user && TogglButton.$user.api_token) ||
        localStorage.getItem('userToken');
    const credentials = opts.credentials || null;

    xhr.open(method, resolvedUrl, true);
    xhr.setRequestHeader('IsTogglButton', 'true');

    if (resolvedUrl.match(TogglButton.$ApiUrl)) {
      if (token) {
        xhr.setRequestHeader(
          'Authorization',
          'Basic ' + btoa(token + ':api_token')
        );
      } else if (credentials) {
        xhr.setRequestHeader(
          'Authorization',
          'Basic ' + btoa(credentials.username + ':' + credentials.password)
        );
      }
    }

    if (opts.onError) {
      xhr.addEventListener('error', function () {
        opts.onError(xhr);
      });
    }
    if (opts.onLoad) {
      xhr.addEventListener('load', function () {
        opts.onLoad(xhr);
      });
    }
    if (opts.mime) {
      xhr.overrideMimeType('application/json');
    }
    xhr.send(JSON.stringify(opts.payload));
  },

  resetPomodoroProgress: function (entry) {
    clearInterval(TogglButton.pomodoroProgressTimer);
    TogglButton.pomodoroProgressTimer = null;
    TogglButton.updateTriggers(entry);
  },

  stopTimeEntryPomodoro: function (timeEntry, sendResponse, cb) {
    return new Promise(async (resolve) => {
      const pomodoroInterval = await db.get('pomodoroInterval');
      const pomodoroDuration = parseInt(pomodoroInterval, 10) * 60;

      if (!TogglButton.$curEntry) {
        resolve();
        return;
      }

      const entry = {
        duration: pomodoroDuration
      };

      TogglButton.ajax(
        `/time_entries/${TogglButton.$curEntry.id}`,
        {
          method: 'PUT',
          payload: entry,
          baseUrl: TogglButton.$ApiV9Url,
          onLoad: function (xhr) {
            if (xhr.status === 200) {
              TogglButton.$latestStoppedEntry = JSON.parse(xhr.responseText);
              TogglButton.updateEntriesDb();
              TogglButton.resetPomodoroProgress(null);
              TogglButton.setNannyTimer();
              ga.reportEvent(timeEntry.type, timeEntry.service);
              resolve({ success: true, type: 'Stop' });
              browser.tabs.query({ active: true, currentWindow: true })
                .then(filterTabs(function (tabs) {
                  browser.tabs.sendMessage(tabs[0].id, { type: 'stop-entry', user: TogglButton.$user });
                }));
            }
          },
          onError: function (xhr) {
            resolve({
              success: false,
              type: 'Update'
            });
          }
        }
      );
    });
  },

  stopTimeEntry: function (timeEntry, sendResponse, cb) {
    return new Promise((resolve) => {
      if (!TogglButton.$curEntry) {
        resolve();
        return;
      }

      const stopTime = timeEntry.stopDate || new Date();
      const startTime = new Date(-TogglButton.$curEntry.duration * 1000);
      const entry = {
        stop: stopTime.toISOString(),
        duration: Math.floor((stopTime - startTime) / 1000)
      };

      TogglButton.ajax(
        `/time_entries/${TogglButton.$curEntry.id}`,
        {
          method: 'PUT',
          baseUrl: TogglButton.$ApiV9Url,
          payload: entry,
          onLoad: function (xhr) {
            if (xhr.status === 200) {
              TogglButton.$latestStoppedEntry = JSON.parse(xhr.responseText);
              TogglButton.updateEntriesDb();
              TogglButton.resetPomodoroProgress(null);
              TogglButton.setNannyTimer();
              ga.reportEvent(timeEntry.type, timeEntry.service);

              resolve({ success: true, type: 'Stop' });
              browser.tabs.query({ active: true, currentWindow: true })
                .then(filterTabs(function (tabs) {
                  browser.tabs.sendMessage(tabs[0].id, { type: 'stop-entry', user: TogglButton.$user });
                }));
            }
          },
          onError: function (xhr) {
            resolve({
              success: false,
              type: 'Stop'
            });
          }
        }
      );
    });
  },

  pomodoroStopTimeTracking: async function () {
    const pomodoroStopTimeTrackingWhenTimerEnds = await db.get('pomodoroStopTimeTrackingWhenTimerEnds');
    if (pomodoroStopTimeTrackingWhenTimerEnds) {
      TogglButton.stopTimeEntryPomodoro({
        type: 'pomodoro-stop',
        service: 'dropdown'
      });
    } else {
      TogglButton.resetPomodoroProgress(TogglButton.$curEntry);
    }
  },

  pomodoroAlarmStop: async function () {
    const pomodoroModeEnabled = await db.get('pomodoroModeEnabled');
    if (!pomodoroModeEnabled) {
      return;
    }

    let notificationId = 'pomodoro-time-is-up';
    let stopSound;
    const latestDescription =
        TogglButton.$curEntry && TogglButton.$curEntry.description
          ? ' (' + TogglButton.$curEntry.description + ')'
          : '';

    let topButtonTitle = 'Continue Latest' + latestDescription;
    let bottomButtonTitle = 'Start New';

    TogglButton.pomodoroStopTimeTracking();

    const pomodoroStopTimeTrackingWhenTimerEnds = await db.get('pomodoroStopTimeTrackingWhenTimerEnds');
    if (!pomodoroStopTimeTrackingWhenTimerEnds) {
      notificationId = 'pomodoro-time-is-up-dont-stop';
      topButtonTitle = 'Stop timer';
      bottomButtonTitle = 'Stop and Start New';
    }

    const options = {
      type: 'basic',
      iconUrl: 'images/icon-128.png',
      title: 'Toggl Button - Pomodoro Timer',
      message: 'Time is up! Take a break',
      priority: 2
    };

    if (!FF) {
      options.requireInteraction = true;
      options.buttons = [
        { title: topButtonTitle },
        { title: bottomButtonTitle }
      ];
    } else {
      const pomodoroStopTimeTrackingWhenTimerEnds = await db.get('pomodoroStopTimeTrackingWhenTimerEnds');
      if (!pomodoroStopTimeTrackingWhenTimerEnds) {
        options.message += '. Click to stop tracking.';
      } else {
        options.message += '. Click to continue tracking.';
      }
    }

    TogglButton.hideNotification(notificationId);
    browser.notifications.create(notificationId, options);

    const pomodoroSoundEnabled = await db.get('pomodoroSoundEnabled');
    if (pomodoroSoundEnabled) {
      const pomodoroSoundFile = await db.get('pomodoroSoundFile');
      const pomodoroSoundVolume = await db.get('pomodoroSoundVolume');
      stopSound = new Audio();
      stopSound.src = pomodoroSoundFile;
      stopSound.volume = pomodoroSoundVolume;
      stopSound.play();
    }

    return undefined;
  },

  updateTimeEntry: function (timeEntry, sendResponse) {
    let entry;
    let error = '';
    let project;

    return new Promise(function (resolve, reject) {
      if (!TogglButton.$curEntry) {
        resolve();
        return;
      }
      entry = {
        description: timeEntry.description,
        pid: timeEntry.pid || null,
        tags: timeEntry.tags,
        tid: timeEntry.tid || null,
        billable: timeEntry.billable,
        wid: TogglButton.$curEntry.wid
      };

      if (entry.pid) {
        project = TogglButton.findProjectByPid(parseInt(entry.pid, 10));
        entry.wid = project && project.wid;
      }

      if (timeEntry.start) {
        entry.start = timeEntry.start;
      }

      if (timeEntry.duration) {
        entry.duration = timeEntry.duration;
      }

      TogglButton.ajax(
        `/time_entries/${TogglButton.$curEntry.id}`,
        {
          method: 'PUT',
          payload: entry,
          baseUrl: TogglButton.$ApiV9Url,
          onLoad: function (xhr) {
            const success = xhr.status === 200;
            try {
              if (success) {
                entry = JSON.parse(xhr.responseText);
                // Not using TogglButton.updateCurrent as the time is not changed
                TogglButton.$curEntry = entry;
                TogglButton.setBrowserAction(entry);
              } else {
                error = xhr.responseText;
              }
              if (timeEntry.respond) {
                resolve({ success: success, type: 'Update', error: error });
              } else {
                resolve();
              }
              ga.reportEvent(timeEntry.type, timeEntry.service);
            } catch (e) {
              report(e);
              resolve({
                success: false,
                type: 'Update'
              });
            }
          },
          onError: function (xhr) {
            resolve({
              success: false,
              type: 'Update'
            });
          }
        }
      );
    });
  },

  setBrowserActionBadge: function () {
    let badge = '';
    if (!TogglButton.$user) {
      badge = 'x';
      TogglButton.setBrowserAction(null);
    }
    browser.browserAction.setBadgeText({ text: badge });
  },

  setBrowserAction: function (runningEntry) {
    let imagePath = {
      '19': 'images/inactive-19.png',
      '38': 'images/inactive-38.png'
    };
    let title = browser.runtime.getManifest().browser_action.default_title;

    TogglButton.updatePopup();
    if (TogglButton.pomodoroProgressTimer) {
      return;
    }
    if (runningEntry) {
      imagePath = {
        '19': 'images/active-19.png',
        '38': 'images/active-38.png'
      };
      if (!!runningEntry.description && runningEntry.description.length > 0) {
        title = runningEntry.description + ' - Toggl';
      } else {
        title = '(no description) - Toggl';
      }
      browser.browserAction.setBadgeText({ text: '' });
    }
    browser.browserAction.setTitle({ title: title });
    browser.browserAction.setIcon({ path: imagePath });
  },

  loginUser: function (request) {
    let error;
    return new Promise((resolve, reject) => {
      TogglButton.ajax('/sessions', {
        method: 'POST',
        onLoad: function (xhr) {
          if (xhr.status === 200) {
            TogglButton.queue.push(TogglButton.checkPermissions);
            TogglButton.fetchUser()
              .then((response) => {
                TogglButton.refreshPage();
                resolve(response);
              })
              .catch(reject);
          } else {
            if (xhr.status === 403) {
              error = 'Wrong Email or Password!';
            }
            bugsnagClient.notify(new Error(`Login failed (${xhr.status})`), {
              metaData: {
                status: xhr.status,
                responseText: xhr.responseText
              }
            });
            resolve({ success: false, error: error });
          }
        },
        onError: function (xhr) {
          resolve({
            success: false,
            type: 'login'
          });
        },
        credentials: {
          username: request.username,
          password: request.password
        }
      });
    });
  },

  logoutUser: function () {
    return new Promise((resolve) => {
      TogglButton.ajax('/sessions?created_with=' + TogglButton.$fullVersion, {
        method: 'DELETE',
        onLoad: function (xhr) {
          TogglButton.$user = null;
          TogglButton.updateTriggers(null);
          localStorage.removeItem('userToken');
          resolve({ success: xhr.status === 200, xhr: xhr });
          if (xhr.status === 200) {
            TogglButton.setBrowserActionBadge();
          }
          TogglButton.refreshPageLogout();
        },
        onError: function (xhr) {
          resolve({
            success: false,
            type: 'logout'
          });
        }
      });
    });
  },

  getEditForm: function () {
    if (!TogglButton.$user) {
      return '';
    }
    return TogglButton.$editForm
      .replace('{projects}', TogglButton.fillProjects())
      .replace('{tags}', TogglButton.fillTags())
      .replace('{billable}', TogglButton.setupBillable());
  },

  setupBillable: function () {
    if (TogglButton.canSeeBillable) {
      return '" tabindex="103';
    }

    return 'no-billable" tabindex="-1';
  },

  fillProjects: function () {
    let html =
        '<p class="project-row" data-pid="0"><span class="tb-project-bullet tb-project-color tb-no-color"></span>No project</p>';
    const projects = TogglButton.$user.projectMap;
    const clients = TogglButton.$user.clientMap;
    const clientNames = TogglButton.$user.clientNameMap;
    const hideWs = TogglButton.$user.workspaces.length > 1 ? '' : ' hide';
    const wsHtml = {};
    let client;
    let project;
    let key = null;
    let ckey = null;
    const keys = [];
    let clientName = 0;
    let i;

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
        wsHtml[element.id][0] =
          '<ul class="ws-list" data-wid="' +
          element.id +
          '" title="' +
          escapeHtml(element.name) +
          '"><li class="ws-row' +
          hideWs +
          '" title="' +
          escapeHtml(element.name.toUpperCase()) +
          '">' +
          escapeHtml(element.name.toUpperCase()) +
          '</li>' +
          '<ul class="client-list" data-cid="0">';
      });

      // Add client list
      for (i = 0; i < keys.length; i++) {
        client = clientNames[keys[i]];
        wsHtml[client.wid][client.name + client.id] =
          '<ul class="client-list" data-cid="' +
          client.id +
          '"><li class="client-row" title="' +
          escapeHtml(client.name) +
          '">' +
          escapeHtml(client.name) +
          '</li>';
      }

      // Add projects
      for (key in projects) {
        if (projects.hasOwnProperty(key)) {
          project = projects[key];
          clientName =
            !!project.cid && !!clients[project.cid]
              ? clients[project.cid].name + project.cid
              : 0;
          wsHtml[project.wid][clientName] += TogglButton.generateProjectItem(
            project
          );
        }
      }

      // create html from array
      for (key in wsHtml) {
        if (wsHtml.hasOwnProperty(key)) {
          for (ckey in wsHtml[key]) {
            if (
              wsHtml[key].hasOwnProperty(ckey) &&
              wsHtml[key][ckey].indexOf('project-row') !== -1
            ) {
              html += wsHtml[key][ckey] + '</ul>';
            }
          }
          html += '</ul>';
        }
      }
    } catch (e) {
      report(e);
    }

    return html;
  },

  generateProjectItem: function (project) {
    const tasks = TogglButton.$user.projectTaskList
      ? TogglButton.$user.projectTaskList[project.id]
      : null;
    let i;
    let tasksCount;
    const hasTasks = tasks ? 'has-tasks' : '';
    let html =
        '<li class="project-row" title="' +
        escapeHtml(project.name) +
        '" data-pid="' +
        project.id +
        '"><span class="tb-project-bullet tb-project-color" style="background-color: ' +
        project.hex_color +
        '"></span>' +
        '<span class="item-name ' +
        hasTasks +
        '" title="' +
        escapeHtml(project.name) +
        '">' +
        escapeHtml(project.name) +
        '</span>';

    if (tasks) {
      tasksCount = tasks.length + ' task';
      if (tasks.length > 1) {
        tasksCount += 's';
      }
      html +=
        '<span class="task-count" title="' +
        tasksCount +
        '">' +
        tasksCount +
        '</span>';
      html += '<ul class="task-list">';

      for (i = 0; i < tasks.length; i++) {
        html +=
          '<li class="task-item" data-tid="' +
          tasks[i].id +
          '" title="' +
          escapeHtml(tasks[i].name) +
          '">' +
          escapeHtml(tasks[i].name) +
          '</li>';
      }

      html += '</ul>';
    }

    return html + '</li>';
  },

  fillTags: function () {
    let html = '<ul class="tag-list">';
    const tags = TogglButton.$user.tagMap;
    let i;
    let key = null;
    const keys = [];

    for (key in tags) {
      if (tags.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    keys.sort();

    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      html +=
        '<li class="tag-item" data-wid="' +
        escapeHtml(tags[key].wid) +
        '" title="' +
        escapeHtml(tags[key].name) +
        '">' +
        escapeHtml(tags[key].name) +
        '</li>';
    }
    return html + '</ul>';
  },

  refreshPage: function () {
    let domain;
    browser.tabs.query({ active: true, currentWindow: true })
      .then(filterTabs(async function (tabs) {
        domain = await TogglButton.extractDomain(tabs[0].url);
        if (domain.file) {
          browser.tabs.reload(tabs[0].id);
        }
      }));
  },

  refreshPageLogout: function () {
    browser.tabs.query({ active: true, currentWindow: true })
      .then(filterTabs(function (tabs) {
        browser.tabs.executeScript(
          tabs[0].id,
          {
            code: "!!document.querySelector('.toggl-button')"
          }).then(
          function (reload) {
            if (!!reload && !!reload[0]) {
              browser.tabs.reload(tabs[0].id);
            }
          }
        );
      }));
  },

  /**
   * Start checking whether the user is 'active', 'idle' or 'locked' for the
   * discard time notification.
   */
  startCheckingUserState: async function () {
    const idleDetectionEnabled = await db.get('idleDetectionEnabled');
    if (
      !TogglButton.$checkingState &&
      idleDetectionEnabled &&
      TogglButton.$curEntry
    ) {
      TogglButton.$checkingUserState = setTimeout(function () {
        browser.idle.queryState(15).then(TogglButton.onUserState);
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
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    minutes = Math.floor(s / 60);
    seconds = s % 60;
    hours = Math.floor(minutes / 60);
    minutes %= 60;
    if (hours > 0) {
      return hours + 'h ' + minutes + 'm';
    }
    if (minutes > 0) {
      return minutes + 'm ' + seconds + 's';
    }
    return seconds + 's';
  },

  showIdleDetectionNotification: function (seconds) {
    const timeString = TogglButton.timeStringFromSeconds(seconds);
    const entryDescription =
        TogglButton.$curEntry.description || '(no description)';
    const options = {
      type: 'basic',
      iconUrl: 'images/icon-128.png',
      title: 'Toggl Button',
      message:
          "You've been idle for " +
          timeString +
          ' while tracking "' +
          entryDescription +
          '"'
    };

    if (!FF) {
      options.buttons = [
        { title: 'Discard idle time' },
        { title: 'Discard idle and continue' }
      ];
    } else {
      options.message += '. Click to discard time.';
    }

    TogglButton.$idleNotificationDiscardSince = TogglButton.$lastWork.date;
    TogglButton.hideNotification('idle-detection');
    browser.notifications.create('idle-detection', options);
  },

  onUserState: function (state) {
    TogglButton.$userState = state;
    const now = new Date();
    const inactiveSeconds = Math.floor((now - TogglButton.$lastWork.date) / 1000);

    if (TogglButton.$user && state === 'active' && TogglButton.$curEntry) {
      // trigger discard time notification once the user has been idle for
      // at least 5min
      if (
        TogglButton.$lastWork.id === TogglButton.$curEntry.id &&
        inactiveSeconds >= 5 * 60
      ) {
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
    browser.idle.queryState(15).then(TogglButton.checkActivity);
  },

  checkActivity: async function (currentState) {
    let secondTitle = 'Open toggl.com';
    let options;

    clearTimeout(TogglButton.$nannyTimer);
    TogglButton.$nannyTimer = null;

    if (
      !!TogglButton.$latestStoppedEntry &&
      !!TogglButton.$latestStoppedEntry.description
    ) {
      secondTitle =
        'Continue (' + TogglButton.$latestStoppedEntry.description + ')';
    }

    const nannyCheckEnabled = await db.get('nannyCheckEnabled');
    const isDuringWorkHours = await TogglButton.isDuringWorkHours();

    if (process.env.DEBUG) {
      console.info(`Checking for tracking reminder, enabled:${nannyCheckEnabled}, isDuringWorkHours:${isDuringWorkHours}`);
    }

    if (
      TogglButton.$user &&
      currentState === 'active' &&
      nannyCheckEnabled &&
      isDuringWorkHours &&
      TogglButton.$curEntry === null
    ) {
      options = {
        type: 'basic',
        iconUrl: 'images/icon-128.png',
        title: 'Toggl Button',
        message: "Don't forget to track your time!"
      };

      if (!FF) {
        options.buttons = [{ title: 'Start timer' }, { title: secondTitle }];
      } else {
        options.message += ' Click to start timer.';
      }

      browser.notifications.create('remind-to-track-time', options);
    }
  },

  startCheckingDayEnd: function (enable) {
    clearInterval(TogglButton.checkingWorkdayEnd);
    if (enable) {
      TogglButton.checkingWorkdayEnd = setInterval(
        TogglButton.checkWorkDayEnd,
        30000
      );
    }
  },

  checkWorkDayEnd: async function () {
    if (!TogglButton.$curEntry) {
      return;
    }

    const stopAtDayEnd = await db.get('stopAtDayEnd');
    const hasWorkdayEnded = await TogglButton.workdayEnded();
    if (
      TogglButton.$user &&
      stopAtDayEnd &&
      TogglButton.$curEntry &&
      hasWorkdayEnded
    ) {
      let title = 'Continue';
      if (TogglButton.$curEntry.description) {
        title += ' (' + TogglButton.$curEntry.description + ')';
      } else {
        title += ' latest';
      }

      const options = {
        type: 'basic',
        iconUrl: 'images/icon-128.png',
        title: 'Toggl Button',
        message: 'Your workday is over, running entry has been stopped'
      };

      if (!FF) {
        options.buttons = [{ title: title }];
      } else {
        options.message += '. Click to continue latest.';
      }

      TogglButton.stopTimeEntry(TogglButton.$curEntry);
      browser.notifications.create('workday-ended-notification', options);
    }
  },

  workdayEnded: async function () {
    if (!TogglButton.$curEntry) {
      return false;
    }
    const startedTime = new Date(TogglButton.$curEntry.start);
    const now = new Date();
    const endTime = new Date();
    const dayEndTime = await db.get('dayEndTime');
    const endTimeHelper = dayEndTime.split(':');

    endTime.setHours(endTimeHelper[0]);
    endTime.setMinutes(endTimeHelper[1]);
    endTime.setSeconds(0);
    return now >= endTime && endTime > startedTime;
  },

  notificationBtnClick: function (notificationId, buttonID) {
    let type = 'dropdown-pomodoro';
    let timeEntry = TogglButton.$curEntry;
    let buttonName = 'start_new';
    let eventType = 'reminder';

    if (notificationId === 'remind-to-track-time') {
      type = 'dropdown-reminder';
      if (buttonID === 0) {
        // start timer
        TogglButton.createTimeEntry({ type: 'timeEntry', service: type }, null);
      } else {
        timeEntry = TogglButton.$latestStoppedEntry;
        if (!!timeEntry && !!timeEntry.description) {
          timeEntry.type = 'timeEntry';
          timeEntry.service = type;
          // continue timer
          TogglButton.createTimeEntry(timeEntry, null);
          buttonName = 'continue';
        } else {
          browser.tabs.create({ url: 'https://toggl.com/app/' });
          buttonName = 'go_to_web';
        }
      }
    } else if (notificationId === 'idle-detection') {
      if (buttonID === 0 || buttonID === 1) {
        buttonName = 'discard';
        // discard idle time
        TogglButton.stopTimeEntry({
          stopDate: TogglButton.$idleNotificationDiscardSince,
          type: 'idle-detection-notification'
        }).then(() => {
          // discard idle time and continue
          if (buttonID === 1) {
            TogglButton.createTimeEntry(timeEntry);
            buttonName = 'discard_continue';
          }
        });
      }
      eventType = 'idle';
    } else if (notificationId === 'pomodoro-time-is-up') {
      if (buttonID === 0) {
        timeEntry = TogglButton.$latestStoppedEntry;
        if (timeEntry) {
          timeEntry.type = 'timeEntry';
          timeEntry.service = type;
        } else {
          timeEntry = { type: 'timeEntry', service: type };
        }
        // continue timer
        TogglButton.createTimeEntry(timeEntry, null);
        buttonName = 'continue';
      } else {
        // start timer
        TogglButton.createTimeEntry({ type: 'timeEntry', service: type }, null);
      }
      eventType = 'pomodoro';
    } else if (notificationId === 'workday-ended-notification') {
      if (buttonID === 0) {
        timeEntry = TogglButton.$latestStoppedEntry;
        if (timeEntry) {
          timeEntry.type = 'timeEntry';
          timeEntry.service = type;
        } else {
          timeEntry = { type: 'timeEntry', service: type };
        }
        // continue timer
        TogglButton.createTimeEntry(timeEntry, null);
        buttonName = 'continue';
      }
      eventType = 'workday-end';
    } else if (notificationId === 'pomodoro-time-is-up-dont-stop') {
      if (buttonID === 0) {
        TogglButton.stopTimeEntry(TogglButton.$curEntry);
      } else {
        TogglButton.createTimeEntry({ type: 'timeEntry', service: type }, null);
      }
      eventType = 'pomodoro';
    }
    if (!FF) {
      TogglButton.onNotificationClicked(notificationId);
    }
    ga.reportEvent(eventType, buttonName);
  },

  isDuringWorkHours: async function () {
    try {
      const now = new Date();
      const nannyFromTo = await db.get('nannyFromTo');
      const fromTo = nannyFromTo.split('-');

      if (now.getDay() === 6 || now.getDay() === 0) {
        return false;
      }
      const startHelper = fromTo[0].split(':');
      const endHelper = fromTo[1].split(':');
      const start = new Date();
      start.setHours(startHelper[0]);
      start.setMinutes(startHelper[1]);

      const end = new Date();
      end.setHours(endHelper[0]);
      end.setMinutes(endHelper[1]);

      return now > start && now <= end;
    } catch (e) {
      bugsnagClient.notify(e);
      return false;
    }
  },

  setNannyTimer: async function () {
    if (TogglButton.$nannyTimer === null && TogglButton.$curEntry === null) {
      TogglButton.hideNotification('remind-to-track-time');
      const nannyInterval = await db.get('nannyInterval');
      TogglButton.$nannyTimer = setTimeout(
        TogglButton.checkState,
        nannyInterval
      );
    }
  },

  // Triggered when user clicks a notification (but not on a button in the notification)
  // N.B. Buttons do not exist in Firefox, so we trigger notificationBtnClick from here in Firefox.
  onNotificationClicked: function (notificationId) {
    if (FF) {
      TogglButton.notificationBtnClick(notificationId, 0);
    }
    if (notificationId === 'remind-to-track-time') {
      TogglButton.setNannyTimer();
    } else {
      TogglButton.hideNotification(notificationId);
    }
  },

  // Triggered when a notification is closed, either by the OS or the user dismissing it
  // N.B. User cannot dismiss it themselves in Firefox.
  // N.B. A notification "expiring" does not trigger this.
  onNotificationClosed: function (notificationId) {
    if (notificationId === 'remind-to-track-time') {
      TogglButton.setNannyTimer();
    } else {
      TogglButton.hideNotification(notificationId);
    }
  },

  hideNotification: function (notificationId) {
    browser.notifications.clear(notificationId);
  },

  checkDailyUpdate: function () {
    const d = new Date();
    const currentDate = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();

    if (
      TogglButton.$lastSyncDate === null ||
      TogglButton.$lastSyncDate !== currentDate
    ) {
      TogglButton.fetchUser();
      TogglButton.$lastSyncDate = currentDate;
    }
  },

  updatePopup: function () {
    const popup = browser.extension.getViews({ type: 'popup' });
    if (!!popup && popup.length && !!popup[0].PopUp) {
      popup[0].PopUp.showPage();
    }
  },

  showRevokedWSView: function () {
    const popup = browser.extension.getViews({ type: 'popup' });
    if (!!popup && popup.length && !!popup[0].PopUp) {
      const PopUp = popup[0].PopUp;
      PopUp.switchView(PopUp.$revokedWorkspaceView);
    }
  },

  calculateSums: function () {
    const now = new Date();
    let todaySum = 0;
    let weekSum = 0;
    const timeEntries = TogglButton.$user.time_entries || [];

    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    // Get today's date at midnight for the local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getWeekStart = function (d) {
      const startDay = TogglButton.$user.beginning_of_week;

      const day = d.getDay();

      const diff = d.getDate() - day + (startDay > day ? startDay - 7 : startDay);

      return new Date(d.setDate(diff));
    };

    const weekStart = getWeekStart(now);

    timeEntries.forEach(function (entry) {
      // Calc today total
      if (new Date(entry.start).getTime() > today.getTime()) {
        if (entry.duration < 0) {
          todaySum += (new Date() - new Date(entry.start)) / 1000;
        } else {
          todaySum += entry.duration;
        }
      }

      // Calc week total
      if (new Date(entry.start).getTime() > weekStart.getTime()) {
        if (entry.duration < 0) {
          weekSum += (new Date() - new Date(entry.start)) / 1000;
        } else {
          weekSum += entry.duration;
        }
      }
    });

    return { today: secToHHMM(todaySum), week: secToHHMM(weekSum) };
  },

  contextMenuClick: function (info, tab) {
    TogglButton.createTimeEntry(
      {
        type: 'timeEntry',
        service: 'contextMenu',
        description: info.selectionText || tab.title
      },
      null
    );
  },

  newMessage: function (request, sender, sendResponse) {
    return new Promise(async (resolve) => {
      let error;
      let errorSource;
      try {
        // db messages
        if (request.type === 'toggle-popup') {
          db.set('showPostPopup', request.state);
        } else if (request.type === 'toggle-nanny') {
          db.updateSetting(
            'nannyCheckEnabled',
            request.state,
            db.togglButton.setNannyTimer
          );
        } else if (request.type === 'toggle-nanny-from-to') {
          const nannyCheckEnabled = await db.get('nannyCheckEnabled');
          db.updateSetting(
            'nannyFromTo',
            request.state,
            db.togglButton.setNannyTimer,
            nannyCheckEnabled
          );
        } else if (request.type === 'toggle-nanny-interval') {
          const nannyCheckEnabled = await db.get('nannyCheckEnabled');
          db.updateSetting(
            'nannyInterval',
            Math.max(request.state, 1000),
            db.togglButton.setNannyTimer,
            nannyCheckEnabled
          );
        } else if (request.type === 'toggle-idle') {
          db.updateSetting(
            'idleDetectionEnabled',
            request.state,
            db.togglButton.startCheckingUserState
          );
        } else if (request.type === 'toggle-pomodoro') {
          db.set('pomodoroModeEnabled', request.state);
        } else if (request.type === 'toggle-pomodoro-sound') {
          db.set('pomodoroSoundEnabled', request.state);
        } else if (request.type === 'toggle-pomodoro-interval') {
          db.updateSetting('pomodoroInterval', request.state);
        } else if (request.type === 'toggle-pomodoro-stop-time') {
          db.set('pomodoroStopTimeTrackingWhenTimerEnds', request.state);
        } else if (request.type === 'update-pomodoro-sound-volume') {
          db.set('pomodoroSoundVolume', request.state);
        } else if (request.type === 'toggle-right-click-button') {
          db.updateSetting('showRightClickButton', request.state);
        } else if (request.type === 'toggle-start-automatically') {
          db.updateSetting('startAutomatically', request.state);
        } else if (request.type === 'toggle-stop-automatically') {
          db.updateSetting('stopAutomatically', request.state);
        } else if (request.type === 'toggle-stop-at-day-end') {
          db.updateSetting('stopAtDayEnd', request.state);
          db.togglButton.startCheckingDayEnd(request.state);
        } else if (request.type === 'toggle-day-end-time') {
          db.updateSetting('dayEndTime', request.state);
        } else if (request.type === 'change-default-project') {
          db.updateSetting(
            db.togglButton.$user.id +
            '-defaultProject',
            request.state
          );
        } else if (request.type === 'change-remember-project-per') {
          db.updateSetting('rememberProjectPer', request.state);
          db.resetDefaultProjects();
        } else if (
          request.type === 'update-dont-show-permissions' ||
          request.type === 'update-settings-active-tab'
        ) {
          db.updateSetting(request.type.substr(7), request.state);
        } else if (
          request.type === 'update-send-usage-statistics'
        ) {
          db.updateSetting('sendUsageStatistics', request.state);
        } else if (
          request.type === 'update-send-error-reports'
        ) {
          db.updateSetting('sendErrorReports', request.state);
        } else if (
          request.type === 'update-enable-auto-tagging'
        ) {
          db.updateSetting('enableAutoTagging', request.state);
        } else if (request.type === 'settings-reset') {
          TogglButton.logoutUser();
          resolve();
          // Background messages
        } else if (request.type === 'activate') {
          TogglButton.checkDailyUpdate();
          TogglButton.setBrowserActionBadge();
          const project = await db.getDefaultProject();
          resolve({
            success: TogglButton.$user !== null,
            user: TogglButton.$user,
            version: TogglButton.$fullVersion,
            defaults: { project }
          });
          TogglButton.setNannyTimer();
        } else if (request.type === 'login') {
          TogglButton.loginUser(request)
            .then((response) => {
              resolve(response);
            })
            .catch(() => resolve(undefined));
        } else if (request.type === 'logout') {
          TogglButton.logoutUser().then(resolve);
        } else if (request.type === 'sync') {
          const res = TogglButton.fetchUser();
          if (request.respond) {
            resolve(res);
          }
        } else if (request.type === 'timeEntry') {
          TogglButton.createTimeEntry(request)
            .then((response) => {
              TogglButton.hideNotification('remind-to-track-time');
              resolve(response);
            });
        } else if (request.type === 'list-continue') {
          TogglButton.createTimeEntry({ ...request.data, respond: request.respond, type: request.type })
            .then(resolve);
          TogglButton.hideNotification('remind-to-track-time');
        } else if (request.type === 'resume') {
          TogglButton.createTimeEntry(
            { ...TogglButton.$latestStoppedEntry, type: 'resume' },
            sendResponse
          );
          TogglButton.hideNotification('remind-to-track-time');
        } else if (request.type === 'update') {
          TogglButton.updateTimeEntry(request, sendResponse)
            .then(resolve);
        } else if (request.type === 'stop') {
          TogglButton
            .stopTimeEntry(request, sendResponse)
            .then(resolve);
        } else if (request.type === 'userToken') {
          if (!TogglButton.$user) {
            TogglButton.fetchUser(request.apiToken);
          }
        } else if (request.type === 'currentEntry') {
          resolve({
            currentEntry: TogglButton.$curEntry
          });
        } else if (request.type === 'error') {
          // Handling integration errors
          error = new Error();
          error.stack = request.stack;
          error.message = request.stack.split('\n')[0];

          // Attempt to extract integration name from content filename
          errorSource = request.stack.split('content/')[1];
          if (errorSource) {
            errorSource = errorSource.split('.js')[0];
          } else {
            errorSource = 'Unknown';
          }

          if (process.env.DEBUG) {
            console.log(error, request.stack);
            console.log(request.category + ' Script Error [' + errorSource + ']');
          } else {
            if (request.category === 'Content') {
              error.name = `Content Error [${errorSource}]`;
              bugsnagClient.notify(error);
            } else {
              report(error);
            }
          }
        } else if (request.type === 'options') {
          browser.runtime.openOptionsPage();
        } else if (request.type === 'create-workspace') {
          TogglButton.createWorkspace(request, sendResponse);
        } else {
          resolve(undefined);
        }
      } catch (e) {
        if (process.env.DEBUG) {
          console.error(e);
        }
        report(e);
        resolve(undefined);
      }
    });
  },

  tabUpdated: async function (tabId, changeInfo, tab) {
    if (!TogglButton.$user && !isTogglURL(tab.url)) {
      TogglButton.setBrowserActionBadge();
      return;
    }
    if (
      changeInfo.status === 'complete' &&
      tab.url.indexOf('chrome://') === -1
    ) {
      const domain = await TogglButton.extractDomain(tab.url, false);
      const permission = { origins: domain.origins };

      if (process.env.DEBUG) {
        console.log('url: ' + tab.url + ' | domain-file: ' + domain.file);
      }

      if (FF) {
        if (domain.file) {
          TogglButton.checkLoadedScripts(tabId, domain.file);
        }
      } else {
        browser.permissions.contains(permission)
          .then(function (result) {
            if (result && !!domain.file) {
              TogglButton.checkLoadedScripts(tabId, domain.file);
            }
          });
      }
    }
  },

  checkLoadedScripts: function (tabId, file) {
    browser.tabs.executeScript(tabId, { code: "(typeof togglbutton === 'undefined')" })
      .then(function (isFirstLoad) {
        if (FF) {
          if (isFirstLoad) {
            TogglButton.loadFiles(tabId, file);
          }
        } else {
          if (!!isFirstLoad && !!isFirstLoad[0]) {
            TogglButton.loadFiles(tabId, file);
          }
        }
      });
  },

  loadFiles: function (tabId, file) {
    if (process.env.DEBUG) {
      console.log('Load content script: [' + file + ']');
    }
    browser.tabs.insertCSS(tabId, { file: 'styles/style.css' })
      .then(function () {
        browser.tabs.insertCSS(tabId, { file: 'styles/autocomplete.css' });
      });

    browser.tabs.executeScript(tabId, { file: 'scripts/common.js' })
      .then(function () {
        browser.tabs.executeScript(tabId, {
          file: 'scripts/content/' + file
        });
      });
  },

  extractDomain: async function (url, checkLogin = true) {
    let domain;
    if (checkLogin && !TogglButton.$user) {
      return false;
    }
    // find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf('://') > -1) {
      domain = url.split('/')[2];
    } else {
      domain = url.split('/')[0];
    }

    // remove www if needed
    // domain = domain.replace("www.", "");

    // remove /* from the end
    domain = domain.split('/*')[0];

    // find & remove port number
    domain = domain.split(':')[0];

    const file = await db.getOriginFileName(domain);
    return {
      file: file,
      origins: ['*://' + domain + '/*']
    };
  },

  toggleRightClickButton: function (show) {
    if (!browser.contextMenus) {
      // Mobile browsers unsupported
      return;
    }

    if (show) {
      browser.contextMenus.create({
        title: 'Start timer',
        contexts: ['page'],
        onclick: TogglButton.contextMenuClick
      });
      browser.contextMenus.create({
        title: "Start timer with description '%s'",
        contexts: ['selection'],
        onclick: TogglButton.contextMenuClick
      });
    } else {
      browser.contextMenus.removeAll();
    }
  },

  startAutomatically: async function () {
    const startAutomatically = await db.get('startAutomatically');
    if (
      !TogglButton.$curEntry &&
      startAutomatically &&
      !!TogglButton.$user
    ) {
      TogglButton.$latestStoppedEntry = TogglButton.latestEntry();
      if (TogglButton.$latestStoppedEntry) {
        TogglButton.createTimeEntry(TogglButton.$latestStoppedEntry, null);
        TogglButton.hideNotification('remind-to-track-time');
      }
    }
  },

  stopTrackingOnBrowserClosed: async function () {
    openWindowsCount--;
    const stopAutomatically = await db.get('stopAutomatically');
    if (
      stopAutomatically &&
      openWindowsCount === 0 &&
      TogglButton.$curEntry
    ) {
      TogglButton.stopTimeEntry(TogglButton.$curEntry);
    }
  },

  checkPermissions: async function (show) {
    const dontShowPermissions = await db.get('dont-show-permissions');
    if (!dontShowPermissions && !FF) {
      browser.permissions.getAll().then(function (results) {
        if (show != null || results.origins.length === 2) {
          show = show != null ? show : 2;
          db.set('settings-active-tab', 2);
          db.set('show-permissions-info', show);
          browser.runtime.openOptionsPage();
        }
      });
    }
  },

  hasWorkspaceBeenRevoked: function (workspaces) {
    return workspaces.length === 0;
  },

  createWorkspace: function (request, sendResponse) {
    const { workspace } = request;
    const payload = {
      name: workspace,
      only_admins_see_team_dashboard: false,
      ical_url: ''
    };

    TogglButton.ajax('', {
      method: 'POST',
      baseUrl: TogglButton.$ApiV9Url,
      payload,
      onLoad: xhr => {
        sendResponse({ type: 'create-workspace', success: xhr.status === 200 });
      },
      onError: xhr => {
        sendResponse({ type: 'create-workspace', success: false });
      }
    });
  }
};

browser.webRequest.onBeforeSendHeaders.addListener(
  function (info) {
    const headers = info.requestHeaders;
    let isTogglButton = false;
    let uaIndex = -1;

    headers.forEach(function (header, i) {
      if (header.name.toLowerCase() === 'user-agent') {
        uaIndex = i;
      }
      if (header.name === 'IsTogglButton') {
        isTogglButton = true;
      }
    });

    if (isTogglButton && uaIndex !== -1) {
      headers[uaIndex].value = `TogglButton/${process.env.VERSION}`;
    }
    return { requestHeaders: headers };
  },
  {
    urls: ['https://www.toggl.com/*', 'https://toggl.com/*'],
    types: ['xmlhttprequest']
  },
  ['blocking', 'requestHeaders']
);

window.db = new Db(TogglButton);
window.ga = new Ga(db);

TogglButton.queue.push(TogglButton.startAutomatically);
db.get('showRightClickButton')
  .then((setting) => {
    TogglButton.toggleRightClickButton(setting);
  });
TogglButton.fetchUser();
TogglButton.setNannyTimer();
TogglButton.startCheckingUserState();
browser.tabs.onUpdated.addListener(TogglButton.tabUpdated);
browser.alarms.onAlarm.addListener(TogglButton.pomodoroAlarmStop);
db.get('stopAtDayEnd').then(TogglButton.startCheckingDayEnd);
browser.runtime.onMessage.addListener(TogglButton.newMessage);
browser.notifications.onClosed.addListener(TogglButton.onNotificationClosed);
browser.notifications.onClicked.addListener(TogglButton.onNotificationClicked);
if (!FF) {
  // not supported in FF
  browser.notifications.onButtonClicked.addListener(TogglButton.notificationBtnClick);
}
browser.windows.onCreated.addListener(TogglButton.startAutomatically);
browser.windows.getAll().then(function (windows) {
  openWindowsCount = windows.length;
});
browser.windows.onCreated.addListener(function () {
  openWindowsCount++;
});
browser.windows.onRemoved.addListener(TogglButton.stopTrackingOnBrowserClosed);

browser.runtime
  .setUninstallURL('https://toggl.com/toggl-button-feedback/')
  .catch(bugsnagClient.notify);

window.onbeforeunload = function () {
  db.get('stopAutomatically')
    .then((stopAutomatically) => {
      if (stopAutomatically && TogglButton.$curEntry) {
        TogglButton.stopTimeEntry(TogglButton.$curEntry);
      }
    });
};

if (!FF) {
  TogglButton.checkPermissions();
}

// Check whether new version is installed
browser.runtime.onInstalled.addListener(function (details) {
  if (details.reason === 'install') {
    if (!FF) TogglButton.checkPermissions(0);
  } else if (details.reason === 'update') {
    console.info(`Updated from ${details.previousVersion} to ${process.env.VERSION}.`);
    const [ prevMajor, prevMinor ] = details.previousVersion.split('.').map(Number);
    const [ nextMajor, nextMinor ] = process.env.VERSION.split('.').map(Number);
    if (prevMajor === 1 && prevMinor <= 22 && nextMajor === 1 && nextMinor >= 23) {
      // Attempt to migrate legacy localstorage settings to storage.sync settings
      db._migrateToStorageSync();
    }
  }
});

if (browser.commands) {
  browser.commands.onCommand.addListener(function (command) {
    const entry = TogglButton.$latestStoppedEntry || {
      type: 'timeEntry',
      service: 'keyboard'
    };
    if (command === 'quick-start-stop-entry') {
      if (TogglButton.$curEntry !== null) {
        TogglButton.stopTimeEntry(TogglButton.$curEntry);
      } else {
        TogglButton.createTimeEntry(entry, null);
      }
    }
  });
}

if (!FF) {
  browser.runtime.onMessageExternal.addListener(function handleVersionMessage (
    request,
    sender,
    sendResponse
  ) {
    if (request && request.message && request.message === 'version') {
      sendResponse({ version: process.env.VERSION });
    }
    return undefined;
  });
}
