/*jslint indent: 2, unparam: true, plusplus: true, nomen: true */
/*global Db: true, window: false, XMLHttpRequest: false, chrome: false, localStorage:false, Bugsnag: false */
"use strict";

var GA,
  GA_TRACKING_ID = "UA-3215787-22",
  GA_KEY = "GA:clientID",
  GA_CLIENT_ID = localStorage.getItem(GA_KEY);

GA = {
  load: function () {
    if (!GA_CLIENT_ID) {
      GA_CLIENT_ID = this.generateGUID();
      localStorage.setItem(GA_KEY, GA_CLIENT_ID);
    }
  },
  report: function (event, service) {
    var request = new XMLHttpRequest(),
      message =
        "v=1&tid=" + GA_TRACKING_ID + "&cid=" + GA_CLIENT_ID + "&aip=1" +
        "&ds=extension&t=event&ec=" + event + "&ea=" + service;

    request.open("POST", "https://www.google-analytics.com/collect", true);
    request.send(message);
  },
  reportEvent: function (event, service) {
    this.report(event, event + "-" + service);
  },
  reportOs: function () {
    var that = this;
    chrome.runtime.getPlatformInfo(function (info) {
      that.report("os", "os-" + info.os);
    });
  },
  reportSettings: function (event, service) {
    this.report('start-automatically', "settings/start-automatically-" + Db.get("startAutomatically"));
    this.report('stop-automatically', "settings/stop-automatically-" + Db.get("stopAutomatically"));
    this.report('right-click-button', "settings/show-right-click-button-" + Db.get("showRightClickButton"));
    this.report('popup', "settings/popup-" + Db.get("showPostPopup"));
    this.report('reminder', "settings/reminder-" + Db.get("nannyCheckEnabled"));
    this.report('reminder-minutes', "settings/reminder-minutes-" + Db.get("nannyInterval"));
    this.report('idle', "settings/idle-detection-" + Db.get("idleDetectionEnabled"));

    this.report('pomodoro', "settings/pomodoro-" + Db.get("pomodoroModeEnabled"));
    if (Db.get("pomodoroModeEnabled")) {
      this.report('pomodoro-sound', "settings/pomodoro-sound-" + Db.get("pomodoroSoundEnabled"));
      if (Db.get("pomodoroSoundEnabled")) {
        this.report('pomodoro-volume', "settings/pomodoro-volume-" + Db.get("pomodoroSoundVolume"));
      }
      this.report('pomodoro-stop', "settings/pomodoro-stop-" + Db.get("pomodoroStopTimeTrackingWhenTimerEnds"));
      this.report('pomodoro-interval', "settings/pomodoro-interval-" + Db.get("pomodoroInterval"));
    }

    this.report('stop-at-day-end', "settings/stop-at-day-end" + Db.get("stopAtDayEnd"));
    if (Db.get("stopAtDayEnd")) {
      this.report('stop-at-day-end-time', "settings/stop-at-day-end-time" + Db.get("dayEndTime"));
    }

    this.report('default-project', "settings/default-project" + Db.get("defaultProject"));
  },

  generateGUID: function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
};

GA.load();