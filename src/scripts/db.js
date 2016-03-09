/*jslint indent: 2, unparam: true, plusplus: true, nomen: true */
/*global window: false, TogglButton: false, XMLHttpRequest: false, WebSocket: false, chrome: false, btoa: false, localStorage:false, document: false, Audio: false, Bugsnag: false */
"use strict";

var Db = {
  // settings: key, default value
  settings: {
    "showRightClickButton": true,
    "showPostPopup": true,
    "socketEnabled": true,
    "nannyCheckEnabled": true,
    "nannyInterval": 3600000,
    "nannyFromTo": "09:00-17:00",
    "idleDetectionEnabled": false,
    "pomodoroModeEnabled": false,
    "pomodoroSoundEnabled": true,
    "pomodoroInterval": 25
  },

  get: function (setting) {
    var value = localStorage.getItem(setting);
    if (!!value) {
      if (value === "false" || value === "true") {
        value = JSON.parse(value);
      }
    }
    return value;
  },

  set: function (setting, value) {
    localStorage.setItem(setting, value);
  },

  load: function (setting, defaultValue) {
    var value = localStorage.getItem(setting);
    if (!!value) {
      if (typeof defaultValue === "boolean") {
        value = JSON.parse(value);
      }
    } else {
      value = defaultValue;
    }
    localStorage.setItem(setting, value);
    return value;
  },

  loadAll: function () {
    var k;
    for (k in Db.settings) {
      if (Db.settings.hasOwnProperty(k)) {
        Db.load(k, Db.settings[k]);
      }
    }
  },

  updateSetting: function (key, state, callback, condition) {
    var c = condition !== null ? condition : state;
    Db.set(key, state);

    if (c && callback !== null) {
      callback();
    }
  },

  setSocket: function (state) {
    Db.set("socketEnabled", state);
    if (TogglButton.$socket !== null) {
      TogglButton.$socket.close();
      TogglButton.$socket = null;
    }
    if (state) {
      if (!!TogglButton.$user) {
        TogglButton.setupSocket();
      } else {
        TogglButton.fetchUser();
      }
    }
  },

  newMessage: function (request, sender, sendResponse) {
    try {
      if (request.type === 'toggle-popup') {
        Db.set("showPostPopup", request.state);
      } else if (request.type === 'toggle-socket') {
        Db.setSocket(request.state);
      } else if (request.type === 'toggle-nanny') {
        Db.updateSetting("nannyCheckEnabled", request.state, TogglButton.triggerNotification);
      } else if (request.type === 'toggle-nanny-from-to') {
        Db.updateSetting("nannyFromTo", request.state, TogglButton.triggerNotification, Db.get("nannyCheckEnabled"));
      } else if (request.type === 'toggle-nanny-interval') {
        Db.updateSetting("nannyInterval", Math.max(request.state, 1000), TogglButton.triggerNotification, Db.get("nannyCheckEnabled"));
      } else if (request.type === 'toggle-idle') {
        Db.updateSetting("idleDetectionEnabled", request.state, TogglButton.startCheckingUserState);
      } else if (request.type === 'toggle-pomodoro') {
        Db.set("pomodoroModeEnabled", request.state);
      } else if (request.type === 'toggle-pomodoro-sound') {
        Db.set("pomodoroSoundEnabled", request.state);
      } else if (request.type === 'toggle-pomodoro-interval') {
        Db.updateSetting("pomodoroInterval", request.state);
      } else if (request.type === 'toggle-right-click-button') {
        Db.updateSetting("showRightClickButton", request.state);
      }
    } catch (e) {
      Bugsnag.notifyException(e);
    }

    return true;
  }
};

chrome.extension.onMessage.addListener(Db.newMessage);
Db.loadAll();
