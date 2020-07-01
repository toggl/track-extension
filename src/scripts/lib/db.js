import browser from 'webextension-polyfill';
import bugsnagClient from './bugsnag';
import storedOrigins from '../origins';

const ORIGINS_KEY = 'TogglButton-origins';

// settings: key, default value
const DEFAULT_SETTINGS = {
  startAutomatically: false,
  stopAutomatically: false,
  showRightClickButton: true,
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
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

  pomodoroTickerEnabled: false,
  pomodoroTickerFile: 'sounds/tick-tock.mp3',
  pomodoroTickerVolume: 1,

  pomodoroInterval: 25,
  pomodoroBreakInterval: 5,
  pomodoroLongBreakInterval: 15,
  pomodoroLongBreakGap: 4,

  stopAtDayEnd: false,
  dayEndTime: '17:00',
  defaultProject: 0,
  rememberProjectPer: 'false',
  enableAutoTagging: false,

  sendErrorReports: true,
  sendUsageStatistics: true
};

const LOCAL_ONLY = {
  [ORIGINS_KEY]: true,
  timeEntriesTracked: true,
  dismissedReviewPrompt: true
};

function isLocalOnly (key) {
  return LOCAL_ONLY[key] || false;
}

function getFileName (origin) {
  if (origin.file) {
    return origin.file;
  }
  return (origin.name || origin).toLowerCase().replace(' ', '-') + '.js';
}

const transformLegacyValue = (value) => {
  if (typeof value !== 'undefined') {
    // Ensure older version's settings still function if they get saved to sync storage.
    if (value === 'false' || value === 'true') {
      return JSON.parse(value);
    }
    return value;
  } else {
    return null;
  }
};

export default class Db {
  constructor (togglButton) {
    this.togglButton = togglButton;
    this.loadAll();
  }

  async getOriginFileName (domain) {
    if (process.env.DEBUG && domain.endsWith('toggl.space')) {
      domain = 'toggl.com';
    }
    let origin = await this.getOrigin(domain);
    const origins = await this.getAllOrigins();

    if (origin && (origin.name || origin.file)) {
      return getFileName(origin);
    }

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

    return getFileName(origins[origin]);
  }

  async getOrigin (origin) {
    const origins = await this.getAllOrigins();
    return origins[origin] || null;
  }

  async setOrigin (newOrigin, baseOrigin) {
    const origins = await this.getAllOrigins();
    origins[newOrigin] = baseOrigin;
    this.set(ORIGINS_KEY, {
      ...origins,
      [newOrigin]: baseOrigin
    });
  }

  async removeOrigin (origin) {
    const origins = await this.getAllOrigins();
    delete origins[origin];
    this.set(ORIGINS_KEY, origins);
  }

  async getAllOrigins () {
    const customOrigins = await this.get(ORIGINS_KEY);
    return {
      ...storedOrigins,
      ...customOrigins
    };
  }

  /**
   * Sets the default project for a given scope
   * @param {number} pid The project id
   * @param {string=} scope The scope to remember that project.
   * If null, then set global default
   */
  async setDefaultProject (pid, scope) {
    const userId = this.togglButton.$user.id;
    let defaultProjects = await this.get(userId + '-defaultProjects', {});
    if (!defaultProjects) defaultProjects = {}; // Catch pre-storage.sync settings

    if (!scope) {
      return this.set(userId + '-defaultProject', pid);
    }
    defaultProjects[scope] = pid;
    this.set(userId + '-defaultProjects', defaultProjects);
  }

  /**
   * Gets the default project for a given scope
   * @param {string=} scope If null, then get global default
   * @returns {number} The default project for the given scope
   */
  async getDefaultProject (scope) {
    if (!this.togglButton.$user) {
      return 0;
    }
    const userId = this.togglButton.$user.id;
    let defaultProjects = await this.get(userId + '-defaultProjects');
    if (!defaultProjects) defaultProjects = {}; // Catch pre-storage.sync settings

    let defaultProject = await this.get(userId + '-defaultProject');
    defaultProject = parseInt(defaultProject || '0', 10);

    if (!scope || !defaultProjects) {
      return defaultProject;
    }
    return defaultProjects[scope] || defaultProject;
  }

  resetDefaultProjects () {
    if (!this.togglButton.$user) {
      return;
    }
    this.set(this.togglButton.$user.id + '-defaultProjects', {});
  }

  // @deprecated defaultVal
  get (key, defaultVal) {
    const defaultValue = defaultVal || DEFAULT_SETTINGS[key];
    const hasDefaultValue = typeof defaultValue !== 'undefined';
    const options = hasDefaultValue
      ? { [key]: defaultValue }
      : key;

    if (isLocalOnly(key)) {
      return this.getLocal(key);
    }

    return browser.storage.sync.get(options)
      .then((result) => {
        let value = result[key];
        if (hasDefaultValue && typeof value !== typeof defaultValue) {
          if (process.env.DEBUG) {
            console.log(`Retrieved setting [${key}] is incorrect type`, value);
          }
          value = defaultValue;
        }

        if (process.env.DEBUG_STORAGE) {
          console.info(`Retrieved value ${key}: `, value);
        }
        return transformLegacyValue(value);
      });
  }

  /**
   * Retrieves multiple settings in one storage call
   * @param {Object} settings Map of setting keys and default values
   * @return {Object} Map of retrieved setting values
   */
  getMultiple (settings) {
    return browser.storage.sync.get(settings)
      .then((result) => {
        if (process.env.DEBUG_STORAGE) {
          console.info(`Retrieved values ${Object.keys(settings).join(', ')}: `, Object.values(result).map(JSON.stringify).join(', '));
        }
        return Object.keys(result).reduce((results, key) => {
          return Object.assign(results, {
            [key]: transformLegacyValue(result[key])
          });
        }, {});
      });
  }

  set (setting, value) {
    if (isLocalOnly(setting)) {
      this.setLocal(setting, value);
      return;
    }

    return browser.storage.sync
      .set({ [setting]: value })
      .catch((e) => {
        console.error(`Error attempting to save ${setting};`, e);
      })
      .finally(() => {
        if (process.env.DEBUG_STORAGE) {
          console.info(`Saved setting ${setting} :`, value);
        }
      });
  }

  setLocal (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  setMultiple (settings) {
    return browser.storage.sync
      .set(settings)
      .catch((e) => {
        console.error(`Error attempting to save settings:`, settings, e);
      })
      .finally(() => {
        if (process.env.DEBUG_STORAGE) {
          console.info(`Saved multiple settings :`, settings);
        }
      });
  }

  getLocal (key) {
    const collection = localStorage.getItem(key);
    if (!collection) {
      return null;
    }
    return JSON.parse(collection);
  }

  load (setting, defaultValue) {
    this.get(setting)
      .then((value) => {
        if (typeof value === 'undefined') {
          value = defaultValue;
        }
        this.set(setting, value);
      });
  }

  loadAll () {
    for (const k in DEFAULT_SETTINGS) {
      if (DEFAULT_SETTINGS.hasOwnProperty(k)) {
        this.load(k, DEFAULT_SETTINGS[k]);
      }
    }
  }

  updateSetting (key, state, callback, condition) {
    const c = condition !== null ? condition : state;
    this.set(key, state);

    if (c && callback !== null) {
      callback();
    }
  }

  async bumpTrackedCount () {
    const timeEntriesTracked = await this.get('timeEntriesTracked') || 0;
    return this.set('timeEntriesTracked', timeEntriesTracked + 1);
  }

  resetAllSettings () {
    const allSettings = { ...DEFAULT_SETTINGS };
    return this.setMultiple(allSettings)
      .then(() => {
        bugsnagClient.leaveBreadcrumb('Completed reset all settings');
      })
      .catch((e) => {
        bugsnagClient.notify(e);
        alert('Failed to reset settings. Please contact support@toggl.com for assistance or try re-installing the extension.');
      });
  }

  _migrateToStorageSync () {
    console.info('Migrating settings to v2');
    bugsnagClient.leaveBreadcrumb('Attempting settings migration to v2');

    try {
      const allSettings = { ...DEFAULT_SETTINGS };
      const oldSettings = Object.keys(allSettings)
        .reduce((accumulator, key) => {
          const defaultValue = allSettings[key];
          let value = localStorage.getItem(key);
          if (value && typeof defaultValue === 'boolean') {
            value = JSON.parse(value);
          }
          accumulator[key] = (typeof value === 'undefined' ? defaultValue : value);
          return accumulator;
        }, {});

      if (process.env.DEBUG) {
        console.log('Found old settings: ', oldSettings);
      }

      this.setMultiple(oldSettings)
        .then(() => {
          console.info('Succesully migrated old settings to v2');
          bugsnagClient.leaveBreadcrumb('Migrated settings to v2');
        })
        .catch((e) => {
          console.error('Failed to migrate settings to v2; ');
          bugsnagClient.notify(e);
        });
    } catch (e) {
      bugsnagClient.notify(e);
    }
  }
}
