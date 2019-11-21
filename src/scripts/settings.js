import browser from 'webextension-polyfill';

import TogglOrigins from './origins';
import bugsnagClient from './lib/bugsnag';
import { getStoreLink, getUrlParam, isActiveUser } from './lib/utils';

let TogglButton = browser.extension.getBackgroundPage().TogglButton;
const ga = browser.extension.getBackgroundPage().ga;
const db = browser.extension.getBackgroundPage().db;
const FF = navigator.userAgent.indexOf('Chrome') === -1;

const DEFAULT_TAB = 'general';

const replaceContent = function (parentSelector, html) {
  const container = document.querySelector(parentSelector);
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  container.appendChild(html);
};

if (FF) {
  document.body.classList.add('ff');
}

document.querySelector('#version').textContent = process.env.VERSION;
document.querySelector('#review-prompt a').href = getStoreLink();
document.querySelector('#review-prompt a').addEventListener('click', dismissReviewPrompt);
document.querySelector('#close-review-prompt').addEventListener('click', dismissReviewPrompt);

const Settings = {
  $startAutomatically: null,
  $stopAutomatically: null,
  $showRightClickButton: null,
  $postPopup: null,
  $nanny: null,
  $pomodoroMode: null,
  $pomodoroSound: null,
  $permissionFilter: document.querySelector('#permission-filter'),
  $permissionFilterClear: document.querySelector('#filter-clear'),
  $permissionsList: document.querySelector('#permissions-list'),
  $newPermission: document.querySelector('#new-permission'),
  $originsSelect: document.querySelector('#origins'),
  origins: [],
  $pomodoroStopTimeTracking: null,
  $stopAtDayEnd: null,
  $defaultProject: null,
  $defaultProjectContainer: null,
  $pomodoroFocusMode: null,
  $pomodoroVolume: null,
  $pomodoroVolumeLabel: null,

  $pomodoroTickerSound: null,
  $pomodoroTickerVolume: null,
  $pomodoroTickerVolumeLabel: null,

  $sendUsageStatistics: null,
  $sendErrorReports: null,
  $enableAutoTagging: null,
  $resetAllSettings: null,
  $loginInfo: document.querySelector('#login-info'),
  $logOut: document.querySelector('#log-out'),
  $syncData: document.querySelector('#sync-data'),
  showPage: async function () {
    const pomodoroSoundVolume = await db.get('pomodoroSoundVolume');
    const volume = parseInt(pomodoroSoundVolume * 100, 10);
    const rememberProjectPer = await db.get('rememberProjectPer');

    try {
      if (!TogglButton) {
        TogglButton = browser.extension.getBackgroundPage().TogglButton;
      }
      Settings.setFromTo();
      const nannyInterval = await db.get('nannyInterval');
      const showRightClickButton = await db.get('showRightClickButton');
      const enableAutoTagging = await db.get('enableAutoTagging');
      const startAutomatically = await db.get('startAutomatically');
      const stopAutomatically = await db.get('stopAutomatically');
      const idleDetectionEnabled = await db.get('idleDetectionEnabled');
      const showPostPopup = await db.get('showPostPopup');
      const nannyCheckEnabled = await db.get('nannyCheckEnabled');
      const pomodoroModeEnabled = await db.get('pomodoroModeEnabled');
      const pomodoroInterval = await db.get('pomodoroInterval');
      const pomodoroFocusMode = await db.get('pomodoroFocusMode');
      const pomodoroSoundEnabled = await db.get('pomodoroSoundEnabled');
      const pomodoroStopTimeTrackingWhenTimerEnds = await db.get('pomodoroStopTimeTrackingWhenTimerEnds');
      const sendUsageStatistics = await db.get('sendUsageStatistics');
      const sendErrorReports = await db.get('sendErrorReports');
      const stopAtDayEnd = await db.get('stopAtDayEnd');
      const dayEndTime = await db.get('dayEndTime');

      Settings.$loginInfo.textContent = TogglButton.$user && TogglButton.$user.email || '';

      document.querySelector('#nag-nanny-interval').value = nannyInterval / 60000;
      Settings.$pomodoroVolume.value = volume;
      Settings.$pomodoroVolumeLabel.textContent = volume + '%';

      const pomodoroTickerEnabled = await db.get('pomodoroTickerEnabled');
      const pomodoroTickerVolume = await db.get('pomodoroTickerVolume');
      const tickerVolume = parseInt(pomodoroTickerVolume * 100, 10);
      Settings.$pomodoroTickerVolume.value = tickerVolume;
      Settings.$pomodoroTickerVolumeLabel.textContent = tickerVolume + '%';
      Settings.toggleState(
        Settings.$pomodoroTickerSound,
        pomodoroTickerEnabled
      );

      Settings.toggleState(
        Settings.$showRightClickButton,
        showRightClickButton
      );
      Settings.toggleState(
        Settings.$enableAutoTagging,
        enableAutoTagging
      );
      Settings.toggleState(
        Settings.$startAutomatically,
        startAutomatically
      );
      Settings.toggleState(
        Settings.$stopAutomatically,
        stopAutomatically
      );
      Settings.toggleState(Settings.$postPopup, showPostPopup);
      Settings.toggleState(Settings.$nanny, nannyCheckEnabled);
      document.querySelector('.field.nag-nanny').classList.toggle('field--showDetails', nannyCheckEnabled);

      Settings.toggleState(
        Settings.$idleDetection,
        idleDetectionEnabled
      );
      Settings.toggleState(
        Settings.$pomodoroMode,
        pomodoroModeEnabled
      );
      document.querySelector('.field.pomodoro-mode').classList.toggle('field--showDetails', pomodoroModeEnabled);
      Settings.toggleState(
        Settings.$pomodoroFocusMode,
        pomodoroFocusMode
      );
      Settings.toggleState(
        Settings.$pomodoroSound,
        pomodoroSoundEnabled
      );
      Settings.toggleState(
        Settings.$pomodoroStopTimeTracking,
        pomodoroStopTimeTrackingWhenTimerEnds
      );
      Settings.toggleState(
        Settings.$sendUsageStatistics,
        sendUsageStatistics
      );
      Settings.toggleState(
        Settings.$sendErrorReports,
        sendErrorReports
      );
      Array.apply(null, Settings.$rememberProjectPer.options).forEach(function (
        option
      ) {
        if (option.value === rememberProjectPer) {
          option.setAttribute('selected', 'selected');
        }
      });

      document.querySelector('#pomodoro-interval').value = pomodoroInterval;

      Settings.toggleState(Settings.$stopAtDayEnd, stopAtDayEnd);
      document.querySelector('#day-end-time').value = dayEndTime;
      document.querySelector('.field.stop-at-day-end').classList.toggle('field--showDetails', stopAtDayEnd);

      Settings.fillDefaultProject();

      ga.reportSettings();

      Settings.loadSitesIntoList();
    } catch (e) {
      browser.runtime.sendMessage({
        type: 'error',
        stack: e.stack,
        category: 'Settings'
      });
    }
  },
  fillDefaultProject: async function () {
    const projects = db.getLocal('projects') || {};
    const hasProjects = Object.keys(projects).length > 0;

    if (hasProjects && !!TogglButton.$user) {
      const defaultProject = await db.getDefaultProject();
      const clients = db.getLocal('clients') || {};

      const html = document.createElement('select');
      html.id = 'default-project';
      html.setAttribute('name', 'default-project');

      let dom = document.createElement('option');
      dom.setAttribute('value', '0');
      dom.textContent = '- No project -';

      html.appendChild(dom);

      for (const key in projects) {
        if (projects.hasOwnProperty(key)) {
          const project = projects[key];
          const clientName =
            !!project.cid && !!clients[project.cid]
              ? ' . ' + clients[project.cid].name
              : '';
          dom = document.createElement('option');

          if (!!defaultProject && parseInt(defaultProject, 10) === project.id) {
            dom.setAttribute('selected', 'selected');
          }

          dom.setAttribute('value', project.id);
          dom.textContent = project.name + clientName;
          html.appendChild(dom);
        }
      }

      Settings.$defaultProjectContainer.appendChild(html);

      Settings.$defaultProject = document.querySelector('#default-project');

      Settings.$defaultProject.addEventListener('change', function (e) {
        const defaultProject =
          Settings.$defaultProject.options[Settings.$defaultProject.selectedIndex].value;

        const rememberPer =
          Settings.$rememberProjectPer.options[Settings.$rememberProjectPer.selectedIndex].value;

        db.setDefaultProject(
          defaultProject,
          rememberPer === 'service'
            ? TogglButton.$curService
            : TogglButton.$curURL
        );
        Settings.saveSetting(defaultProject, 'change-default-project');
      });
    }
  },
  getAllPermissions: function () {
    const items = document.querySelectorAll('#permissions-list li input');

    let urls = [];

    let i;

    let current;

    for (i = 0; i < items.length; i++) {
      current = items[i].getAttribute('data-host');
      if (current.indexOf('toggl') === -1) {
        if (current.indexOf(',') !== -1) {
          urls = urls.concat(current.split(','));
        } else {
          urls.push(current);
        }
      }
    }
    return { origins: urls };
  },
  setFromTo: async function () {
    const nannyFromTo = await db.get('nannyFromTo');
    const fromTo = nannyFromTo.split('-');
    document.querySelector('#nag-nanny-from').value = fromTo[0];
    document.querySelector('#nag-nanny-to').value = fromTo[1];
  },
  toggleState: function (elem, state) {
    elem.checked = state;
  },
  toggleSetting: function (elem, state, type) {
    const request = {
      type: type,
      state: state
    };
    if (elem !== null) {
      Settings.toggleState(elem, state);
    }
    browser.runtime.sendMessage(request);
  },
  saveSetting: function (value, type) {
    Settings.toggleSetting(null, value, type);
  },
  loadSitesIntoList: async function () {
    let html;
    let htmlList;
    let customHtml;
    let option;
    let li;
    let input;
    let dom;
    let url;
    let name;
    let i;
    let k;
    let origins;
    let disabled;
    let checked;
    let customs;
    let tmpkey;

    try {
      // Load Custom Permissions list

      // Defined custom domain list
      customHtml = document.createElement('ul');
      customHtml.id = 'custom-permissions-list';
      customHtml.className = 'origin-list';

      customs = await db.getAllOrigins();
      for (k in customs) {
        if (customs.hasOwnProperty(k) && !!TogglOrigins[customs[k]]) {
          li = document.createElement('li');

          dom = document.createElement('a');
          dom.className = 'remove-custom';
          dom.textContent = 'delete';
          li.appendChild(dom);

          dom = document.createElement('strong');
          dom.textContent = k;
          li.appendChild(dom);

          li.appendChild(document.createTextNode(' - '));

          dom = document.createElement('i');
          dom.textContent = TogglOrigins[customs[k]].name;
          li.appendChild(dom);

          customHtml.appendChild(li);
        }
      }

      replaceContent('#custom-perm-container', customHtml);

      // Load permissions list
      browser.permissions.getAll().then(function (results) {
        let key;

        try {
          Settings.origins = [];
          origins = results.origins;
          for (i = 0; i < origins.length; i++) {
            name = url = origins[i]
              .replace('*://*.', '')
              .replace('*://', '')
              .replace('/*', '');
            if (url.split('.').length > 2) {
              name = url.substr(url.indexOf('.') + 1);
            }
            Settings.origins[name] = {
              id: i,
              origin: origins[i],
              url: url,
              name: name
            };
          }

          // list of enabled/disabled origins
          htmlList = document.createElement('ul');
          htmlList.id = 'permissions-list';
          htmlList.className = 'origin-list';

          // custom permission integration select
          html = document.createElement('select');
          html.id = 'origins';

          for (key in TogglOrigins) {
            if (TogglOrigins.hasOwnProperty(key)) {
              disabled = '';
              checked = 'checked';

              if (!Settings.origins[key]) {
                // Handle cases where subdomain is used (like web.any.do, we remove web from the beginning)
                tmpkey = key.split('.');
                tmpkey.shift();
                tmpkey = tmpkey.join('.');
                if (!Settings.origins[tmpkey]) {
                  disabled = 'disabled';
                  checked = '';
                }
              }

              // Don't display all different urls for 1 service
              if (!TogglOrigins[key].clone) {
                option = document.createElement('option');
                option.id = 'origin';
                option.value = key;
                option.setAttribute('data-id', i);
                option.textContent = TogglOrigins[key].name;

                html.appendChild(option);
              }

              // Don't show toggl.com as it's not optional
              if (key.indexOf('toggl') === -1 && !!TogglOrigins[key].url) {
                li = document.createElement('li');
                li.id = key;
                li.className = disabled;

                input = document.createElement('input');
                input.className = 'toggle';
                input.setAttribute('type', 'checkbox');
                input.setAttribute('data-host', TogglOrigins[key].url);
                if (checked) {
                  input.setAttribute('checked', 'checked');
                }

                dom = document.createElement('div');
                dom.textContent = `${TogglOrigins[key].name} - ${key}`;

                li.appendChild(input);
                li.appendChild(dom);

                htmlList.appendChild(li);
              }
            }
          }

          replaceContent('#perm-container', htmlList);
          replaceContent('#origins-container', html);

          Settings.enablePermissionEvents();
        } catch (e) {
          browser.runtime.sendMessage({
            type: 'error',
            stack: e.stack,
            category: 'Settings'
          });
        }
      });
    } catch (e) {
      browser.runtime.sendMessage({
        type: 'error',
        stack: e.stack,
        category: 'Settings'
      });
    }
  },

  addCustomOrigin: function (e) {
    let text = Settings.$newPermission.value;
    const o = Settings.$originsSelect;

    if (text.indexOf(':') !== -1) {
      text = text.split(':')[0];
    }
    if (text.indexOf('//') !== -1) {
      text = text.split('//')[1];
    }

    Settings.$newPermission.value = text;
    const domain = '*://' + Settings.$newPermission.value + '/';
    const permission = { origins: [domain] };

    browser.permissions.request(permission)
      .then(function (result) {
        if (result) {
          db.setOrigin(Settings.$newPermission.value, o.value)
            .then(() => {
              Settings.$newPermission.value = '';
              Settings.loadSitesIntoList();
              document.location.hash = domain;
            });
        } else {
          Settings.loadSitesIntoList();
        }
      });
  },

  removeCustomOrigin: function (e) {
    let custom;
    let domain;
    let permission;
    let parent;
    let removed = false;

    if (e.target.className === 'remove-custom') {
      parent = e.target.parentNode;
      custom = parent.querySelector('strong').textContent;
      domain = '*://' + custom + '/';
      permission = { origins: [domain] };

      browser.permissions.contains(permission).then(function (allowed) {
        if (allowed) {
          browser.permissions.remove(permission).then(function (result) {
            if (result) {
              removed = true;
              db.removeOrigin(custom);
              parent.remove();
            } else {
              alert('Fail');
            }
          });
        } else {
          alert('No "' + custom + '" host permission found.');
        }
      });

      if (!removed) {
        db.removeOrigin(custom);
        parent.remove();
      }
    }
    return false;
  },

  toggleOrigin: function (e) {
    let target = e.target;

    if (e.target.tagName !== 'INPUT') {
      target = e.target.querySelector('input');
      if (!target) target = e.target.parentElement.querySelector('input');
      target.checked = !target.checked;
    }

    const permission = { origins: target.getAttribute('data-host').split(',') };

    if (target.checked) {
      browser.permissions.request(permission).then(function (result) {
        if (result) {
          target.parentNode.classList.remove('disabled');
        } else {
          target.checked = false;
        }
      });
    } else {
      browser.permissions.contains(permission).then(function (allowed) {
        if (allowed) {
          browser.permissions.remove(permission).then(function (result) {
            if (result) {
              target.parentNode.classList.add('disabled');
            } else {
              target.checked = true;
            }
          });
        } else {
          alert(
            'No "' +
            Settings.origins[target.getAttribute('data-id')] +
            '" host permission found.'
          );
        }
      });
    }
  },

  enableAllOrigins: function (e) {
    browser.permissions.request(Settings.getAllPermissions()).then(function (result) {
      if (result) {
        Settings.loadSitesIntoList();
      }
    });
  },

  disableAllOrigins: function (e) {
    browser.permissions.getAll().then(async function (result) {
      const origins = [];
      let i;
      let key;
      const allOrigins = await db.getAllOrigins();
      const customOrigins = {};
      let skip = false;

      try {
        for (key in allOrigins) {
          if (typeof allOrigins[key] === 'string') {
            customOrigins[key] = allOrigins[key];
          }
        }

        for (i = 0; i < result.origins.length; i++) {
          for (key in customOrigins) {
            if (result.origins[i].indexOf(key) !== -1) {
              skip = true;
            }
          }

          if (
            result.origins[i].indexOf('toggl') === -1 &&
            result.origins[i] !== '*://*/*' &&
            !skip
          ) {
            origins.push(result.origins[i]);
          }
          skip = false;
        }
      } catch (e) {
        browser.runtime.sendMessage({
          type: 'error',
          stack: e.stack,
          category: 'Settings'
        });
      }

      browser.permissions.remove({ origins: origins }).then(function (result, b) {
        if (result) {
          Settings.loadSitesIntoList();
        }
      });
    });
  },

  enablePermissionEvents: function () {
    Settings.$originsSelect = document.querySelector('#origins');

    // Add custom permission (custom domain)
    const $addCustomOrigin = document.querySelector('#add-permission');
    $addCustomOrigin.removeEventListener('click', Settings.addCustomOrigin);
    $addCustomOrigin.addEventListener('click', Settings.addCustomOrigin);

    // Remove item from custom domain list
    const $removeCustomOrigin = document.querySelector('#custom-perm-container');
    $removeCustomOrigin.removeEventListener('click', Settings.removeCustomOrigin);
    $removeCustomOrigin.addEventListener('click', Settings.removeCustomOrigin);

    Settings.$permissionsList = document.querySelector('#permissions-list');

    // Enable/Disable origin permissions
    const $originList = document.querySelector('#permissions-list');
    $originList.removeEventListener('click', Settings.toggleOrigin);
    $originList.addEventListener('click', Settings.toggleOrigin);

    // Enable all predefined origins
    const $enableAllOrigins = document.querySelector('.enable-all');
    $enableAllOrigins.addEventListener('click', Settings.enableAllOrigins);
    $enableAllOrigins.addEventListener('click', Settings.enableAllOrigins);

    // Disable all predefined origins
    const $disableAllOrigins = document.querySelector('.disable-all');
    $disableAllOrigins.removeEventListener('click', Settings.disableAllOrigins);
    $disableAllOrigins.addEventListener('click', Settings.disableAllOrigins);
  }
};

document.addEventListener('DOMContentLoaded', async function (e) {
  try {
    Settings.$pomodoroVolume = document.querySelector('#sound-volume');
    Settings.$pomodoroVolumeLabel = document.querySelector('#volume-label');
    Settings.$startAutomatically = document.querySelector(
      '#start_automatically'
    );
    Settings.$stopAutomatically = document.querySelector('#stop_automatically');
    Settings.$showRightClickButton = document.querySelector(
      '#show_right_click_button'
    );
    Settings.$postPopup = document.querySelector('#show_post_start_popup');
    Settings.$nanny = document.querySelector('#nag-nanny');
    Settings.$idleDetection = document.querySelector('#idle-detection');
    Settings.$pomodoroMode = document.querySelector('#pomodoro-mode');
    Settings.$pomodoroFocusMode = document.querySelector('#pomodoro-focus-mode');
    Settings.$pomodoroSound = document.querySelector('#enable-sound-signal');
    Settings.$pomodoroStopTimeTracking = document.querySelector(
      '#pomodoro-stop-time'
    );
    Settings.$stopAtDayEnd = document.querySelector('#stop-at-day-end');
    Settings.$defaultProjectContainer = document.querySelector(
      '#default-project-container'
    );
    Settings.$rememberProjectPer = document.querySelector(
      '#remember-project-per'
    );
    Settings.$sendUsageStatistics = document.querySelector(
      '#send-usage-statistics'
    );
    Settings.$sendErrorReports = document.querySelector('#send-error-reports');
    Settings.$enableAutoTagging = document.querySelector('#enable-auto-tagging');
    Settings.$resetAllSettings = document.querySelector('#reset-all-settings');

    // Pomordoro focus interval sound elements
    Settings.$pomodoroTickerSound = document.querySelector('#enable-ticker-sound');
    Settings.$pomodoroTickerVolume = document.querySelector('#ticker-sound-volume');
    Settings.$pomodoroTickerVolumeLabel = document.querySelector('#ticker-volume-label');

    // Show permissions page with notice
    const dontShowPermissions = await db.get('dont-show-permissions');
    if (
      !dontShowPermissions
    ) {
      const showPermissionsInfo = await db.get('show-permissions-info');
      document.querySelector('.guide-container').style.display = 'flex';
      document.querySelector(
        ".guide > div[data-id='" + (showPermissionsInfo || 0) + "']"
      ).style.display =
        'block';
      document
        .querySelector('.guide button')
        .setAttribute('data-id', showPermissionsInfo || 0);
      db.set('show-permissions-info', 0);
    }

    // Change active tab if present in search param
    const activeTabParam = getUrlParam(document.location, 'tab');
    changeActiveTab(activeTabParam || DEFAULT_TAB);

    document.querySelector('body').style.display = 'flex';

    Settings.showPage();

    let filterTimerId = null;
    const updateFilteredList = function (val) {
      if (val.length > 0) {
        Settings.$permissionsList.classList.add('filtered');
        Settings.$permissionFilterClear.style.display = 'block';
      } else {
        Settings.$permissionsList.classList.remove('filtered');
        Settings.$permissionFilterClear.style.display = 'none';
      }

      const permissionItems = document.querySelectorAll('#permissions-list li');
      permissionItems.forEach((item) => {
        if (item.textContent.toLowerCase().indexOf(val) !== -1) {
          item.classList.add('filter');
        } else if (item.classList) {
          item.classList.remove('filter');
        }
      });
    };
    Settings.$permissionFilter.addEventListener('keyup', function (e) {
      const val = Settings.$permissionFilter.value;
      if (filterTimerId) {
        clearTimeout(filterTimerId);
      }
      filterTimerId = setTimeout(() => updateFilteredList(val), 250);
    });

    Settings.$permissionFilterClear.addEventListener('click', function (e) {
      Settings.$permissionFilterClear.style.display = 'none';
      Settings.$permissionFilter.value = '';
      Settings.$permissionsList.classList.remove('filtered');
    });

    Settings.$showRightClickButton.addEventListener('click', async function (e) {
      const showRightClickButton = await db.get('showRightClickButton');
      Settings.toggleSetting(
        e.target,
        !showRightClickButton,
        'toggle-right-click-button'
      );
      TogglButton.toggleRightClickButton(!showRightClickButton);
    });
    Settings.$enableAutoTagging.addEventListener('click', async function (e) {
      const enableAutoTagging = await db.get('enableAutoTagging');
      Settings.toggleSetting(e.target, !enableAutoTagging, 'update-enable-auto-tagging');
    });
    Settings.$startAutomatically.addEventListener('click', async function (e) {
      const startAutomatically = await db.get('startAutomatically');
      Settings.toggleSetting(e.target, !startAutomatically, 'toggle-start-automatically');
    });
    Settings.$stopAutomatically.addEventListener('click', async function (e) {
      const stopAutomatically = await db.get('stopAutomatically');
      Settings.toggleSetting(e.target, !stopAutomatically, 'toggle-stop-automatically');
    });
    Settings.$postPopup.addEventListener('click', async function (e) {
      const showPostPopup = await db.get('showPostPopup');
      Settings.toggleSetting(e.target, !showPostPopup, 'toggle-popup');
    });
    Settings.$nanny.addEventListener('click', async function (e) {
      const nannyCheckEnabled = await db.get('nannyCheckEnabled');
      Settings.toggleSetting(e.target, !nannyCheckEnabled, 'toggle-nanny');
      document.querySelector('.field.nag-nanny').classList.toggle('field--showDetails', !nannyCheckEnabled);
    });
    Settings.$idleDetection.addEventListener('click', async function (e) {
      const idleDetectionEnabled = await db.get('idleDetectionEnabled');
      Settings.toggleSetting(e.target, !idleDetectionEnabled, 'toggle-idle');
    });
    Settings.$pomodoroMode.addEventListener('click', async function (e) {
      const pomodoroModeEnabled = await db.get('pomodoroModeEnabled');
      Settings.toggleSetting(e.target, !pomodoroModeEnabled, 'toggle-pomodoro');
      document.querySelector('.field.pomodoro-mode').classList.toggle('field--showDetails', !pomodoroModeEnabled);
    });
    Settings.$pomodoroFocusMode.addEventListener('click', async function (e) {
      const pomodoroFocusMode = await db.get('pomodoroFocusMode');
      Settings.toggleSetting(e.target, !pomodoroFocusMode, 'toggle-pomodoro-focus-mode');
    });
    Settings.$pomodoroSound.addEventListener('click', async function (e) {
      const pomodoroSoundEnabled = await db.get('pomodoroSoundEnabled');
      Settings.toggleSetting(e.target, !pomodoroSoundEnabled, 'toggle-pomodoro-sound');
    });
    Settings.$pomodoroStopTimeTracking.addEventListener('click', async function (e) {
      const pomodoroStopTimeTrackingWhenTimerEnds = await db.get('pomodoroStopTimeTrackingWhenTimerEnds');
      Settings.toggleSetting(e.target, !pomodoroStopTimeTrackingWhenTimerEnds, 'toggle-pomodoro-stop-time');
    });

    Settings.$stopAtDayEnd.addEventListener('click', async function (e) {
      const stopAtDayEnd = await db.get('stopAtDayEnd');
      Settings.toggleSetting(e.target, !stopAtDayEnd, 'toggle-stop-at-day-end');
      document.querySelector('.field.stop-at-day-end').classList.toggle('field--showDetails', !stopAtDayEnd);
    });

    Settings.$rememberProjectPer.addEventListener('change', function (e) {
      let rememberPer =
        Settings.$rememberProjectPer.options[Settings.$rememberProjectPer.selectedIndex].value;
      if (rememberPer === 'false') {
        rememberPer = false;
      }
      Settings.saveSetting(rememberPer, 'change-remember-project-per');
    });

    document.querySelector('.tab-links').addEventListener('click', e => {
      const tabLink = e.target.closest('.tab-link');
      const selectedTab = tabLink.dataset.tab;
      changeActiveTab(selectedTab);
    });

    Settings.$pomodoroVolume.addEventListener('input', function (e) {
      Settings.$pomodoroVolumeLabel.textContent = e.target.value + '%';
    });

    Settings.$pomodoroVolume.addEventListener('change', function (e) {
      Settings.saveSetting(
        e.target.value / 100,
        'update-pomodoro-sound-volume'
      );
      Settings.$pomodoroVolumeLabel.textContent = e.target.value + '%';
    });

    document
      .querySelector('#sound-test')
      .addEventListener('click', async function (e) {
        const sound = new Audio();
        const soundFile = await db.get('pomodoroSoundFile');
        sound.src = '../' + soundFile;
        sound.volume = Settings.$pomodoroVolume.value / 100;
        sound.play();
      });

    // Pomodoro interval listeners
    Settings.$pomodoroTickerSound.addEventListener('click', async function (e) {
      const pomodoroTickerEnabled = await db.get('pomodoroTickerEnabled');
      await db.set('pomodoroTickerEnabled', !pomodoroTickerEnabled);
    });

    Settings.$pomodoroTickerVolume.addEventListener('input', function (e) {
      Settings.$pomodoroTickerVolumeLabel.textContent = e.target.value + '%';
    });

    Settings.$pomodoroTickerVolume.addEventListener('change', async function (e) {
      await db.set(
        'pomodoroTickerVolume',
        e.target.value / 100
      );
      Settings.$pomodoroTickerVolumeLabel.textContent = e.target.value + '%';
    });

    const tickerSoundTest = document.querySelector('#ticker-sound-test');
    const tickerSound = new Audio();
    let isPlaying = false;

    tickerSoundTest
      .addEventListener('click', async function () {
        if (isPlaying) {
          tickerSound.pause();
          isPlaying = false;
          tickerSoundTest.innerHTML = 'Test';
          return;
        }
        isPlaying = true;
        tickerSoundTest.innerHTML = 'Stop';
        const soundFile = await db.get('pomodoroTickerFile');
        tickerSound.src = '../' + soundFile;
        tickerSound.volume = Settings.$pomodoroTickerVolume.value / 100;
        tickerSound.loop = true;
        tickerSound.play();
      });

    const saveNagNanny = (e) => {
      if (e.target.value.length === 0) {
        Settings.setFromTo();
        return;
      }
      const fromTo =
          document.querySelector('#nag-nanny-from').value +
          '-' +
          document.querySelector('#nag-nanny-to').value;
      Settings.saveSetting(fromTo, 'toggle-nanny-from-to');
    };

    document
      .querySelector('#nag-nanny-from')
      .addEventListener('blur', saveNagNanny);
    document
      .querySelector('#nag-nanny-to')
      .addEventListener('blur', saveNagNanny);
    document
      .querySelector('#nag-nanny-interval')
      .addEventListener('blur', function (e) {
        if (e.target.value < 1) {
          e.target.value = 1;
          return;
        }
        Settings.saveSetting(
          document.querySelector('#nag-nanny-interval').value * 60000,
          'toggle-nanny-interval'
        );
      });

    document
      .querySelector('#pomodoro-interval')
      .addEventListener('blur', function (e) {
        if (e.target.value < 1) {
          e.target.value = 1;
          return;
        }
        Settings.saveSetting(
          +document.querySelector('#pomodoro-interval').value,
          'toggle-pomodoro-interval'
        );
      });

    document
      .querySelector('#day-end-time')
      .addEventListener('blur', function (e) {
        if (e.target.value < 1) {
          e.target.value = 1;
          return;
        }
        Settings.saveSetting(
          document.querySelector('#day-end-time').value,
          'toggle-day-end-time'
        );
      });

    document.querySelector('.container').addEventListener(
      'transitionend',
      function (e) {
        if (
          e.propertyName === 'height' &&
          e.target.className === 'subsettings-details' &&
          e.target.clientHeight > 0
        ) {
          e.target.scrollIntoView();
        }
      },
      false
    );

    document
      .querySelector('.guide button')
      .addEventListener('click', function (e) {
        const disableChecked = document.querySelector(
          '#disable-permission-notice'
        ).checked;
        db.set('dont-show-permissions', disableChecked);
        document.querySelector('.guide-container').style.display = 'none';
        document.querySelector(
          ".guide > div[data-id='" + e.target.getAttribute('data-id') + "']"
        ).style.display =
          'none';
      });

    Settings.$resetAllSettings.addEventListener('click', function (e) {
      bugsnagClient.leaveBreadcrumb('Triggered reset all settings');
      const isConfirmed = confirm('Are you sure you want to reset your settings?');
      if (!isConfirmed) {
        bugsnagClient.leaveBreadcrumb('Cancelled reset all settings');
        return;
      }

      bugsnagClient.leaveBreadcrumb('Confirmed reset all settings');
      db.resetAllSettings()
        .then(() => {
          browser.runtime
            .sendMessage({ type: 'settings-reset' })
            .then(() => window.location.reload())
            .catch(() => window.location.reload());
        });
    });

    Settings.$sendUsageStatistics.addEventListener('click', async function (e) {
      const sendUsageStatistics = await db.get('sendUsageStatistics');
      Settings.toggleSetting(e.target, !sendUsageStatistics, 'update-send-usage-statistics');
    });

    Settings.$sendErrorReports.addEventListener('click', async function (e) {
      const sendErrorReports = await db.get('sendErrorReports');
      Settings.toggleSetting(e.target, !sendErrorReports, 'update-send-error-reports');
    });

    Settings.$logOut.addEventListener('click', function (e) {
      e.preventDefault();
      browser.runtime
        .sendMessage({ type: 'logout' })
        .then(() => {
          window.close();
        });
    });

    Settings.$syncData.addEventListener('click', function (e) {
      e.preventDefault();
      browser.runtime
        .sendMessage({ type: 'sync' })
        .then(() => {
          // TODO: This promise does not respond.
          window.close();
        });
    });

    Settings.loadSitesIntoList();

    const shouldShowReviewPrompt = await isActiveUser(db);
    if (shouldShowReviewPrompt) {
      showReviewPrompt();
    }
  } catch (err) {
    browser.runtime.sendMessage({
      type: 'error',
      stack: err.stack,
      category: 'Settings'
    });
  }
});

function changeActiveTab (name) {
  document.querySelectorAll('.active').forEach(e => {
    e.classList.remove('active');
  });

  const tabEls = document.querySelectorAll(`[data-tab="${name}"]`);
  tabEls.forEach(e => e.classList.add('active'));

  if (tabEls.length === 0) {
    console.error(new Error(`changeActiveTab: Invalid tab name: ${name}`));
  }
}

async function showReviewPrompt () {
  const dismissedReviewPrompt = await db.get('dismissedReviewPrompt');
  if (dismissedReviewPrompt) {
    return;
  }
  document.body.dataset.showReviewBanner = true;
}

function dismissReviewPrompt () {
  document.body.dataset.showReviewBanner = false;
  db.set('dismissedReviewPrompt', true);
}
