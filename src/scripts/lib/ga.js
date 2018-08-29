import { report } from './utils';

const GA_KEY = 'GA:clientID';

export default class Ga {
  clientId = localStorage.getItem(GA_KEY);

  constructor(db) {
    this.db = db;

    this.load();
  }

  load() {
    if (!this.clientId) {
      this.clientId = generateGUID();
      localStorage.setItem(GA_KEY, this.clientId);
    }
  }

  report(event, service) {
    var request = new XMLHttpRequest(),
      message =
        'v=1&tid=' +
        process.env.GA_TRACKING_ID +
        '&cid=' +
        this.clientId +
        '&aip=1' +
        '&ds=extension&t=event&ec=' +
        event +
        '&ea=' +
        service;

    request.open('POST', 'https://www.google-analytics.com/collect', true);
    request.send(message);
  }

  reportEvent(event, service) {
    this.report(event, event + '-' + service);
  }

  reportOs() {
    var that = this;
    chrome.runtime.getPlatformInfo(function(info) {
      that.report('os', 'os-' + info.os);
    });
  }

  reportSettings(event, service) {
    this.report(
      'start-automatically',
      'settings/start-automatically-' + this.db.get('startAutomatically')
    );
    this.report(
      'stop-automatically',
      'settings/stop-automatically-' + this.db.get('stopAutomatically')
    );
    this.report(
      'right-click-button',
      'settings/show-right-click-button-' + this.db.get('showRightClickButton')
    );
    this.report('popup', 'settings/popup-' + this.db.get('showPostPopup'));
    this.report('reminder', 'settings/reminder-' + this.db.get('nannyCheckEnabled'));
    this.report(
      'reminder-minutes',
      'settings/reminder-minutes-' + this.db.get('nannyInterval')
    );
    this.report(
      'idle',
      'settings/idle-detection-' + this.db.get('idleDetectionEnabled')
    );

    this.report(
      'pomodoro',
      'settings/pomodoro-' + this.db.get('pomodoroModeEnabled')
    );
    if (this.db.get('pomodoroModeEnabled')) {
      this.report(
        'pomodoro-sound',
        'settings/pomodoro-sound-' + this.db.get('pomodoroSoundEnabled')
      );
      if (this.db.get('pomodoroSoundEnabled')) {
        this.report(
          'pomodoro-volume',
          'settings/pomodoro-volume-' + this.db.get('pomodoroSoundVolume')
        );
      }
      this.report(
        'pomodoro-stop',
        'settings/pomodoro-stop-' +
          this.db.get('pomodoroStopTimeTrackingWhenTimerEnds')
      );
      this.report(
        'pomodoro-interval',
        'settings/pomodoro-interval-' + this.db.get('pomodoroInterval')
      );
    }

    this.report(
      'stop-at-day-end',
      'settings/stop-at-day-end' + this.db.get('stopAtDayEnd')
    );
    if (this.db.get('stopAtDayEnd')) {
      this.report(
        'stop-at-day-end-time',
        'settings/stop-at-day-end-time' + this.db.get('dayEndTime')
      );
    }
    this.report(
      'remember-project-per',
      'settings/remember-project-per-' + this.db.get('rememberProjectPer')
    );

    if (this.db.getDefaultProject()) {
      this.report('default-project', 'settings/default-project');
    }
  }
}

function generateGUID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  );
}
