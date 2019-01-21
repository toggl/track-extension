import './lib/bugsnag';
import TogglOrigins from './origins';

let TogglButton = chrome.extension.getBackgroundPage().TogglButton;

const ga = chrome.extension.getBackgroundPage().ga;

const db = chrome.extension.getBackgroundPage().db;

const FF = navigator.userAgent.indexOf('Chrome') === -1;

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

document.querySelector('#version').textContent = `(${process.env.VERSION})`;

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
  $pomodoroVolume: null,
  $pomodoroVolumeLabel: null,
  $sendUsageStatistics: null,
  $sendErrorReports: null,
  $enableAutoTagging: null,
  showPage: function () {
    const volume = parseInt(db.get('pomodoroSoundVolume') * 100, 10);

    const rememberProjectPer = db.get('rememberProjectPer');

    try {
      if (!TogglButton) {
        TogglButton = chrome.extension.getBackgroundPage().TogglButton;
      }
      Settings.setFromTo();
      document.querySelector('#nag-nanny-interval').value =
        db.get('nannyInterval') / 60000;
      Settings.$pomodoroVolume.value = volume;
      Settings.$pomodoroVolumeLabel.textContent = volume + '%';
      Settings.toggleState(
        Settings.$showRightClickButton,
        db.get('showRightClickButton')
      );
      Settings.toggleState(
        Settings.$enableAutoTagging,
        db.get('enableAutoTagging')
      );
      Settings.toggleState(
        Settings.$startAutomatically,
        db.get('startAutomatically')
      );
      Settings.toggleState(
        Settings.$stopAutomatically,
        db.get('stopAutomatically')
      );
      Settings.toggleState(Settings.$postPopup, db.get('showPostPopup'));
      Settings.toggleState(Settings.$nanny, db.get('nannyCheckEnabled'));
      Settings.toggleState(
        Settings.$idleDetection,
        db.get('idleDetectionEnabled')
      );
      Settings.toggleState(
        Settings.$pomodoroMode,
        db.get('pomodoroModeEnabled')
      );
      Settings.toggleState(
        Settings.$pomodoroSound,
        db.get('pomodoroSoundEnabled')
      );
      Settings.toggleState(
        Settings.$pomodoroStopTimeTracking,
        db.get('pomodoroStopTimeTrackingWhenTimerEnds')
      );
      Settings.toggleState(
        Settings.$sendUsageStatistics,
        db.get('sendUsageStatistics')
      );
      Settings.toggleState(
        Settings.$sendErrorReports,
        db.get('sendErrorReports')
      );
      Array.apply(null, Settings.$rememberProjectPer.options).forEach(function (
        option
      ) {
        if (option.value === rememberProjectPer) {
          option.setAttribute('selected', 'selected');
        }
      });

      document.querySelector('#pomodoro-interval').value = db.get(
        'pomodoroInterval'
      );

      Settings.toggleState(Settings.$stopAtDayEnd, db.get('stopAtDayEnd'));
      document.querySelector('#day-end-time').value = db.get('dayEndTime');

      Settings.fillDefaultProject();

      ga.reportSettings();

      Settings.loadSitesIntoList();
    } catch (e) {
      chrome.runtime.sendMessage({
        type: 'error',
        stack: e.stack,
        category: 'Settings'
      });
    }
  },
  fillDefaultProject: function () {
    let key; let project; let clientName; let projects; let clients; let defProject; let html; let dom;
    if (db.get('projects') !== '' && !!TogglButton.$user) {
      defProject = db.getDefaultProject();
      projects = JSON.parse(db.get('projects'));
      clients = JSON.parse(db.get('clients'));

      html = document.createElement('select');
      html.id = 'default-project';
      html.setAttribute('name', 'default-project');

      dom = document.createElement('option');
      dom.setAttribute('value', '0');
      dom.textContent = '- No project -';

      html.appendChild(dom);

      for (key in projects) {
        if (projects.hasOwnProperty(key)) {
          project = projects[key];
          clientName =
            !!project.cid && !!clients[project.cid]
              ? ' . ' + clients[project.cid].name
              : '';
          dom = document.createElement('option');

          if (!!defProject && parseInt(defProject, 10) === project.id) {
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
  setFromTo: function () {
    const fromTo = db.get('nannyFromTo').split('-');
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
    chrome.runtime.sendMessage(request);
  },
  saveSetting: function (value, type) {
    Settings.toggleSetting(null, value, type);
  },
  loadSitesIntoList: function () {
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

      customs = db.getAllOrigins();
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
      chrome.permissions.getAll(function (results) {
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
                dom.textContent = key;

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
          chrome.runtime.sendMessage({
            type: 'error',
            stack: e.stack,
            category: 'Settings'
          });
        }
      });
    } catch (e) {
      chrome.runtime.sendMessage({
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

    chrome.permissions.request(permission, function (result) {
      if (result) {
        db.setOrigin(Settings.$newPermission.value, o.value);
        Settings.$newPermission.value = '';
      }
      Settings.loadSitesIntoList();
      if (result) {
        document.location.hash = domain;
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

      chrome.permissions.contains(permission, function (allowed) {
        if (allowed) {
          chrome.permissions.remove(permission, function (result) {
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
      target.checked = !target.checked;
    }

    const permission = { origins: target.getAttribute('data-host').split(',') };

    if (target.checked) {
      chrome.permissions.request(permission, function (result) {
        if (result) {
          target.parentNode.classList.remove('disabled');
        } else {
          target.checked = false;
        }
      });
    } else {
      chrome.permissions.contains(permission, function (allowed) {
        if (allowed) {
          chrome.permissions.remove(permission, function (result) {
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
    chrome.permissions.request(Settings.getAllPermissions(), function (result) {
      if (result) {
        Settings.loadSitesIntoList();
      }
    });
  },

  disableAllOrigins: function (e) {
    chrome.permissions.getAll(function (result) {
      const origins = [];
      let i;
      let key;
      const customOrigins = db.getAllOrigins();
      let skip = false;

      try {
        for (i = 0; i < result.origins.length; i++) {
          for (key in customOrigins) {
            if (customOrigins.hasOwnProperty(key) && !skip) {
              if (result.origins[i].indexOf(key) !== -1) {
                skip = true;
              }
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
        console.error(e);
        chrome.runtime.sendMessage({
          type: 'error',
          stack: e.stack,
          category: 'Settings'
        });
      }

      chrome.permissions.remove({ origins: origins }, function (result, b) {
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

document.addEventListener('DOMContentLoaded', function (e) {
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

    // Show permissions page with notice
    if (
      !db.get('dont-show-permissions')
    ) {
      document.querySelector('.guide-container').style.display = 'flex';
      document.querySelector(
        ".guide > div[data-id='" + db.get('show-permissions-info') + "']"
      ).style.display =
        'block';
      document
        .querySelector('.guide button')
        .setAttribute('data-id', db.get('show-permissions-info'));
      db.set('show-permissions-info', 0);
    }

    // Change active tab.
    const activeTab = Number.parseInt(db.get('settings-active-tab'), 10);
    changeActiveTab(activeTab);
    document.querySelector('body').style.display = 'block';

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
        if (item.id.indexOf(val) !== -1) {
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

    Settings.$showRightClickButton.addEventListener('click', function (e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('showRightClickButton') !== 'true',
        'toggle-right-click-button'
      );
      TogglButton.toggleRightClickButton(
        localStorage.getItem('showRightClickButton') !== 'true'
      );
    });
    Settings.$enableAutoTagging.addEventListener('click', function (e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('enableAutoTagging') !== 'true',
        'update-enable-auto-tagging'
      );
    });
    Settings.$startAutomatically.addEventListener('click', function (e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('startAutomatically') !== 'true',
        'toggle-start-automatically'
      );
    });
    Settings.$stopAutomatically.addEventListener('click', function (e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('stopAutomatically') !== 'true',
        'toggle-stop-automatically'
      );
    });
    Settings.$postPopup.addEventListener('click', function (e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('showPostPopup') !== 'true',
        'toggle-popup'
      );
    });
    Settings.$nanny.addEventListener('click', function (e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('nannyCheckEnabled') !== 'true',
        'toggle-nanny'
      );
    });
    Settings.$idleDetection.addEventListener('click', function (e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('idleDetectionEnabled') !== 'true',
        'toggle-idle'
      );
    });
    Settings.$pomodoroMode.addEventListener('click', function (e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('pomodoroModeEnabled') !== 'true',
        'toggle-pomodoro'
      );
    });
    Settings.$pomodoroSound.addEventListener('click', function (e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('pomodoroSoundEnabled') !== 'true',
        'toggle-pomodoro-sound'
      );
    });
    Settings.$pomodoroStopTimeTracking.addEventListener('click', function (e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('pomodoroStopTimeTrackingWhenTimerEnds') !==
        'true',
        'toggle-pomodoro-stop-time'
      );
    });

    Settings.$stopAtDayEnd.addEventListener('click', function (e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('stopAtDayEnd') !== 'true',
        'toggle-stop-at-day-end'
      );
    });

    Settings.$rememberProjectPer.addEventListener('change', function (e) {
      let rememberPer =
        Settings.$rememberProjectPer.options[Settings.$rememberProjectPer.selectedIndex].value;
      if (rememberPer === 'false') {
        rememberPer = false;
      }
      Settings.saveSetting(rememberPer, 'change-remember-project-per');
    });

    document.querySelectorAll('.tab-links .tab-link').forEach(tab =>
      tab.addEventListener('click', function (e) {
        const index = [...e.target.parentElement.children].indexOf(e.target);

        Settings.saveSetting(index, 'update-settings-active-tab');
        changeActiveTab(index);
      })
    );

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
      .addEventListener('click', function (e) {
        const sound = new Audio();
        sound.src = '../' + db.get('pomodoroSoundFile');
        sound.volume = Settings.$pomodoroVolume.value / 100;
        sound.play();
      });

    document
      .querySelector('#nag-nanny-from')
      .addEventListener('blur', function (e) {
        if (e.target.value.length === 0) {
          Settings.setFromTo();
          return;
        }
        Settings.$fromTo =
          e.target.value + '-' + document.querySelector('#nag-nanny-to').value;
        Settings.saveSetting();
      });
    document
      .querySelector('#nag-nanny-to')
      .addEventListener('blur', function (e) {
        if (e.target.value.length === 0) {
          Settings.setFromTo();
          return;
        }
        const fromTo =
          document.querySelector('#nag-nanny-from').value +
          '-' +
          e.target.value;
        Settings.saveSetting(fromTo, 'toggle-nanny-from-to');
      });
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

    Settings.$sendUsageStatistics.addEventListener('click', function (e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('sendUsageStatistics') !== 'true',
        'update-send-usage-statistics'
      );
    });

    Settings.$sendErrorReports.addEventListener('click', function (e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('sendErrorReports') !== 'true',
        'update-send-error-reports'
      );
    });

    Settings.loadSitesIntoList();
  } catch (err) {
    chrome.runtime.sendMessage({
      type: 'error',
      stack: err.stack,
      category: 'Settings'
    });
  }
});

function changeActiveTab (index) {
  document.querySelectorAll('.active').forEach(e => {
    e.classList.remove('active');
  });

  document.querySelector('.tabs').children[index].classList.add('active');
  document.querySelector('.tab-links').children[index].classList.add('active');
}
