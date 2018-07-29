import bugsnagClient from './bugsnag';
import origins from '../origins';

export default class Db {
  originsKey = 'TogglButton-origins';

  // settings: key, default value
  settings = {
    startAutomatically: false,
    stopAutomatically: false,
    showRightClickButton: true,
    showPostPopup: true,
    nannyCheckEnabled: true,
    nannyInterval: 3600000,
    nannyFromTo: '09:00-17:00',
    idleDetectionEnabled: false,
    pomodoroModeEnabled: false,
    pomodoroSoundFile: 'sounds/time_is_up_1.mp3',
    pomodoroSoundEnabled: true,
    pomodoroSoundVolume: 1,
    pomodoroStopTimeTrackingWhenTimerEnds: true,
    pomodoroInterval: 25,
    stopAtDayEnd: false,
    dayEndTime: '17:00',
    defaultProject: 0,
    projects: '',
    rememberProjectPer: 'false'
  };

  // core settings: key, default value
  core = {
    'dont-show-permissions': false,
    'show-permissions-info': 0,
    'selected-settings-tab': 1
  };

  newMessage = (request, sender, sendResponse) => {
    try {
      if (request.type === 'toggle-popup') {
        this.set('showPostPopup', request.state);
      } else if (request.type === 'toggle-nanny') {
        this.updateSetting(
          'nannyCheckEnabled',
          request.state,
          this.togglButton.triggerNotification
        );
      } else if (request.type === 'toggle-nanny-from-to') {
        this.updateSetting(
          'nannyFromTo',
          request.state,
          this.togglButton.triggerNotification,
          this.get('nannyCheckEnabled')
        );
      } else if (request.type === 'toggle-nanny-interval') {
        this.updateSetting(
          'nannyInterval',
          Math.max(request.state, 1000),
          this.togglButton.triggerNotification,
          this.get('nannyCheckEnabled')
        );
      } else if (request.type === 'toggle-idle') {
        this.updateSetting(
          'idleDetectionEnabled',
          request.state,
          this.togglButton.startCheckingUserState
        );
      } else if (request.type === 'toggle-pomodoro') {
        this.set('pomodoroModeEnabled', request.state);
      } else if (request.type === 'toggle-pomodoro-sound') {
        this.set('pomodoroSoundEnabled', request.state);
      } else if (request.type === 'toggle-pomodoro-interval') {
        this.updateSetting('pomodoroInterval', request.state);
      } else if (request.type === 'toggle-pomodoro-stop-time') {
        this.set('pomodoroStopTimeTrackingWhenTimerEnds', request.state);
      } else if (request.type === 'update-pomodoro-sound-volume') {
        this.set('pomodoroSoundVolume', request.state);
      } else if (request.type === 'toggle-right-click-button') {
        this.updateSetting('showRightClickButton', request.state);
      } else if (request.type === 'toggle-start-automatically') {
        this.updateSetting('startAutomatically', request.state);
      } else if (request.type === 'toggle-stop-automatically') {
        this.updateSetting('stopAutomatically', request.state);
      } else if (request.type === 'toggle-stop-at-day-end') {
        this.updateSetting('stopAtDayEnd', request.state);
        this.togglButton.startCheckingDayEnd(request.state);
      } else if (request.type === 'toggle-day-end-time') {
        this.updateSetting('dayEndTime', request.state);
      } else if (request.type === 'change-default-project') {
        this.updateSetting(
          chrome.extension.getBackgroundPage().this.togglButton.$user.id +
            '-defaultProject',
          request.state
        );
      } else if (request.type === 'change-remember-project-per') {
        this.updateSetting('rememberProjectPer', request.state);
        this.resetDefaultProjects();
      } else if (
        request.type === 'update-dont-show-permissions' ||
        request.type === 'update-selected-settings-tab'
      ) {
        this.updateSetting(request.type.substr(7), request.state);
      }
    } catch (e) {
      bugsnagClient.notify(e);
    }

    return true;
  };

  constructor(togglButton) {
    this.togglButton = togglButton;
    this.loadAll();

    chrome.runtime.onMessage.addListener(this.newMessage);
  }

  getOriginFileName(domain) {
    var origin = this.getOrigin(domain),
      item;

    if (!origin) {
      origin = domain;
    }

    if (!origins[origin]) {
      // Handle cases where subdomain is used (like web.any.do (or sub1.sub2.any.do), we remove web from the beginning)
      origin = origin.split('.');
      while (origin.length > 0 && !origins[origin.join('.')]) {
        origin.shift();
      }
      origin = origin.join('.');
      if (!origins[origin]) {
        return null;
      }
    }

    item = origins[origin];

    if (!!item.file) {
      return item.file;
    }

    return item.name.toLowerCase().replace(' ', '-') + '.js';
  }

  getOrigin(origin) {
    var origins = localStorage.getItem(this.originsKey),
      obj;
    if (!!origins) {
      obj = JSON.parse(origins);
      return obj[origin];
    }
    return null;
  }

  setOrigin(newOrigin, baseOrigin) {
    var origins = localStorage.getItem(this.originsKey),
      obj = {};

    if (!!origins) {
      obj = JSON.parse(origins);
    }
    obj[newOrigin] = baseOrigin;
    localStorage.setItem(this.originsKey, JSON.stringify(obj));
  }

  removeOrigin(origin) {
    var origins = localStorage.getItem(this.originsKey),
      obj;

    if (!!origins) {
      obj = JSON.parse(origins);
      delete obj[origin];
      localStorage.setItem(this.originsKey, JSON.stringify(obj));
    }
  }

  getAllOrigins() {
    var origins = localStorage.getItem(this.originsKey),
      obj;
    if (!!origins) {
      obj = JSON.parse(origins);
      return obj;
    }
    return null;
  }

  /**
   * Sets the default project for a given scope
   * @param {number} pid The project id
   * @param {string=} scope The scope to remember that project.
   * If null, then set global default
   */
  setDefaultProject(pid, scope) {
    var userId = this.togglButton.$user.id,
      defaultProjects = JSON.parse(this.get(userId + '-defaultProjects')) || {};
    if (!scope) {
      return this.set(userId + '-defaultProject', pid);
    }
    defaultProjects[scope] = pid;
    this.set(userId + '-defaultProjects', JSON.stringify(defaultProjects));
  }

  /**
   * Gets the default project for a given scope
   * @param {string=} scope If null, then get global default
   * @returns {number} The default project for the given scope
   */
  getDefaultProject(scope) {
    if (!this.togglButton.$user) {
      return 0;
    }
    var userId = this.togglButton.$user.id,
      defaultProjects = JSON.parse(this.get(userId + '-defaultProjects')),
      defaultProject = parseInt(
        this.get(userId + '-defaultProject') || '0',
        10
      );
    if (!scope || !defaultProjects) {
      return defaultProject;
    }
    return defaultProjects[scope] || defaultProject;
  }

  resetDefaultProjects() {
    if (!this.togglButton.$user) {
      return;
    }
    this.set(this.togglButton.$user.id + '-defaultProjects', null);
  }

  get(setting) {
    var value = localStorage.getItem(setting);
    if (!!value) {
      if (value === 'false' || value === 'true') {
        value = JSON.parse(value);
      }
    }
    return value;
  }

  set(setting, value) {
    localStorage.setItem(setting, value);
  }

  load(setting, defaultValue) {
    var value = localStorage.getItem(setting);
    if (!!value) {
      if (typeof defaultValue === 'boolean') {
        value = JSON.parse(value);
      }
    } else {
      value = defaultValue;
    }
    localStorage.setItem(setting, value);
    return value;
  }

  loadAll() {
    var k;
    for (k in this.settings) {
      if (this.settings.hasOwnProperty(k)) {
        this.load(k, this.settings[k]);
      }
    }

    for (k in this.core) {
      if (this.core.hasOwnProperty(k)) {
        this.load(k, this.core[k]);
      }
    }
  }

  updateSetting(key, state, callback, condition) {
    var c = condition !== null ? condition : state;
    this.set(key, state);

    if (c && callback !== null) {
      callback();
    }
  }
}
