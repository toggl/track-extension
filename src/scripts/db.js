/*jslint indent: 2, unparam: true, plusplus: true, nomen: true */
/*global window: false, XMLHttpRequest: false, WebSocket: false, chrome: false, btoa: false, localStorage:false, document: false, Audio: false, Bugsnag: false */
"use strict";

var Db = {
  // settings: key, default value
  settings: {
    "showPostPopup": true,
    "socketEnabled": true,
    "nannyCheckEnabled": true,
    "nannyInterval": 360000,
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
  }
};