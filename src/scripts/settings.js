import './lib/bugsnag';
import TogglOrigins from './origins';

var TogglButton = chrome.extension.getBackgroundPage().TogglButton,
  ga = chrome.extension.getBackgroundPage().ga,
  db = chrome.extension.getBackgroundPage().db,
  FF = navigator.userAgent.indexOf('Chrome') === -1,
  w = window.innerWidth,
  replaceContent = function(parentSelector, html) {
    var container = document.querySelector(parentSelector);
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(html);
  },
  setTabPosFF = function(elem) {
    var left = '0';

    if (elem.getAttribute('data-tab') === '2') {
      left = '-' + (w + 15) + 'px';
    } else if (elem.getAttribute('data-tab') === '3') {
      left = '-' + 2 * (w + 15) + 'px';
    }
    elem.style.left = left;
  };

if (FF) {
  document.querySelector('html').classList.add('ff');
}

var Settings = {
  eventsSet: false,
  $startAutomatically: null,
  $stopAutomatically: null,
  $showRightClickButton: null,
  $postPopup: null,
  $nanny: null,
  $pomodoroMode: null,
  $pomodoroSound: null,
  lastFilter: null,
  $permissionFilter: document.querySelector('#permission-filter'),
  $permissionFilterClear: document.querySelector('#filter-clear'),
  permissionItems: [],
  $permissionsList: document.querySelector('#permissions-list'),
  $newPermission: document.querySelector('#new-permission'),
  $originsSelect: document.querySelector('#origins'),
  origins: [],
  $pomodoroStopTimeTracking: null,
  $stopAtDayEnd: null,
  $tabs: null,
  $defaultProject: null,
  $defaultProjectContainer: null,
  $pomodoroVolume: null,
  $pomodoroVolumeLabel: null,
  showPage: function() {
    var volume = parseInt(db.get('pomodoroSoundVolume') * 100, 10),
      rememberProjectPer = db.get('rememberProjectPer'),
      a;

    try {
      if (!TogglButton) {
        TogglButton = chrome.extension.getBackgroundPage().TogglButton;
      }
      a = document.createElement('a');
      a.title = 'Changelog';
      a.setAttribute('href', 'http://toggl.github.io/toggl-button');
      a.textContent = `(${process.env.VERSION})`;
      document.querySelector('#version').appendChild(a);
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
      Array.apply(null, Settings.$rememberProjectPer.options).forEach(function(
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
  fillDefaultProject: function() {
    var key, project, clientName, projects, clients, defProject, html, dom;
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

      Settings.$defaultProject.addEventListener('change', function(e) {
        var defaultProject =
          Settings.$defaultProject.options[
            Settings.$defaultProject.selectedIndex
          ].value;
        Settings.saveSetting(defaultProject, 'change-default-project');
      });
    }
  },
  getAllPermissions: function() {
    var items = document.querySelectorAll('#permissions-list li input'),
      urls = [],
      i,
      current;

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
  setFromTo: function() {
    var fromTo = db.get('nannyFromTo').split('-');
    document.querySelector('#nag-nanny-from').value = fromTo[0];
    document.querySelector('#nag-nanny-to').value = fromTo[1];
  },
  toggleState: function(elem, state) {
    elem.checked = state;
  },
  toggleSetting: function(elem, state, type) {
    var request = {
      type: type,
      state: state
    };
    if (elem !== null) {
      Settings.toggleState(elem, state);
    }
    chrome.runtime.sendMessage(request);
  },
  saveSetting: function(value, type) {
    Settings.toggleSetting(null, value, type);
  },
  loadSitesIntoList: function() {
    var html,
      html_list,
      custom_html,
      option,
      li,
      input,
      dom,
      url,
      name,
      i,
      k,
      origins,
      disabled,
      checked,
      customs,
      tmpkey,
      keyc;

    try {
      // Load Custom Permissions list

      // Defined custom domain list
      custom_html = document.createElement('ul');
      custom_html.id = 'custom-permissions-list';
      custom_html.className = 'origin-list';

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

          custom_html.appendChild(li);
        }
      }

      replaceContent('#custom-perm-container', custom_html);

      if (FF) {
        try {
          Settings.origins = [];
          // custom permission integration select
          html = document.createElement('select');
          html.id = 'origins';
          for (keyc in TogglOrigins) {
            if (TogglOrigins.hasOwnProperty(keyc)) {
              // Don't display all different urls for 1 service
              if (!TogglOrigins[keyc].clone) {
                option = document.createElement('option');
                option.id = 'origin';
                option.value = keyc;
                option.setAttribute('data-id', i);
                option.textContent = TogglOrigins[keyc].name;

                html.appendChild(option);
              }
            }
          }
          replaceContent('#origins-container', html);

          Settings.enablePermissionEvents();
        } catch (e) {
          chrome.runtime.sendMessage({
            type: 'error',
            stack: e.stack,
            category: 'Settings'
          });
        }
      } else {
        // Load permissions list
        chrome.permissions.getAll(function(results) {
          var key;

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
            html_list = document.createElement('ul');
            html_list.id = 'permissions-list';
            html_list.className = 'origin-list';

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
                  if (!!checked) {
                    input.setAttribute('checked', 'checked');
                  }

                  dom = document.createElement('div');
                  dom.textContent = key;

                  li.appendChild(input);
                  li.appendChild(dom);

                  html_list.appendChild(li);
                }
              }
            }

            replaceContent('#perm-container', html_list);
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
      }
    } catch (e) {
      chrome.runtime.sendMessage({
        type: 'error',
        stack: e.stack,
        category: 'Settings'
      });
    }
  },

  enablePermissionEvents: function() {
    if (Settings.eventsSet) {
      return;
    }
    Settings.$originsSelect = document.querySelector('#origins');

    // Add custom permission (custom domain)
    document
      .querySelector('#add-permission')
      .addEventListener('click', function(e) {
        var text = Settings.$newPermission.value,
          domain,
          permission,
          o = Settings.$originsSelect;

        if (text.indexOf(':') !== -1) {
          text = text.split(':')[0];
        }
        if (text.indexOf('//') !== -1) {
          text = text.split('//')[1];
        }

        Settings.$newPermission.value = text;
        domain = '*://' + Settings.$newPermission.value + '/';
        permission = { origins: [domain] };
        if (FF) {
          db.setOrigin(Settings.$newPermission.value, o.value);
          Settings.$newPermission.value = '';
          Settings.loadSitesIntoList();
        } else {
          chrome.permissions.request(permission, function(result) {
            if (result) {
              db.setOrigin(Settings.$newPermission.value, o.value);
              Settings.$newPermission.value = '';
            }
            Settings.loadSitesIntoList();
            if (result) {
              document.location.hash = domain;
            }
          });
        }
      });
    // Remove item from custom domain list
    document
      .querySelector('#custom-perm-container')
      .addEventListener('click', function(e) {
        var custom,
          domain,
          permission,
          parent,
          removed = false;
        if (e.target.className === 'remove-custom') {
          parent = e.target.parentNode;
          custom = parent.querySelector('strong').textContent;
          domain = '*://' + custom + '/';
          permission = { origins: [domain] };

          if (FF) {
            db.removeOrigin(custom);
            parent.remove();
          } else {
            chrome.permissions.contains(permission, function(allowed) {
              if (allowed) {
                chrome.permissions.remove(permission, function(result) {
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
        }
        return false;
      });

    if (FF) {
      Settings.eventsSet = true;
      return;
    }

    Settings.$permissionsList = document.querySelector('#permissions-list');

    // Enable/Disable origin permissions
    document
      .querySelector('#permissions-list')
      .addEventListener('click', function(e) {
        var permission,
          target = e.target;

        if (e.target.tagName !== 'INPUT') {
          target = e.target.querySelector('input');
          target.checked = !target.checked;
        }

        permission = { origins: target.getAttribute('data-host').split(',') };

        if (target.checked) {
          chrome.permissions.request(permission, function(result) {
            if (result) {
              target.parentNode.classList.remove('disabled');
            } else {
              target.checked = false;
            }
          });
        } else {
          chrome.permissions.contains(permission, function(allowed) {
            if (allowed) {
              chrome.permissions.remove(permission, function(result) {
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
      });

    // Enable all predefined origins
    document
      .querySelector('.enable-all')
      .addEventListener('click', function(e) {
        chrome.permissions.request(Settings.getAllPermissions(), function(
          result
        ) {
          if (result) {
            Settings.loadSitesIntoList();
          }
        });
      });

    // Disable all predefined origins
    document
      .querySelector('.disable-all')
      .addEventListener('click', function(e) {
        chrome.permissions.getAll(function(result) {
          var origins = [],
            i,
            key,
            customOrigins = db.getAllOrigins(),
            skip = false;

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
            chrome.runtime.sendMessage({
              type: 'error',
              stack: e.stack,
              category: 'Settings'
            });
          }

          chrome.permissions.remove({ origins: origins }, function(result) {
            if (result) {
              Settings.loadSitesIntoList();
            }
          });
        });
      });
  }
};

document.addEventListener('DOMContentLoaded', function(e) {
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
    Settings.$tabs = document.querySelector('.tabs');
    Settings.$defaultProjectContainer = document.querySelector(
      '#default-project-container'
    );
    Settings.$rememberProjectPer = document.querySelector(
      '#remember-project-per'
    );

    // Show permissions page with notice
    if (
      !!parseInt(db.get('show-permissions-info'), 10) &&
      !db.get('dont-show-permissions')
    ) {
      document.querySelector('.guide-container').style.display = 'block';
      document.querySelector(
        ".guide > div[data-id='" + db.get('show-permissions-info') + "']"
      ).style.display =
        'block';
      document
        .querySelector('.guide button')
        .setAttribute('data-id', db.get('show-permissions-info'));
      db.set('show-permissions-info', 0);
    }

    // Set selected tab
    Settings.$tabs.setAttribute('data-tab', db.get('selected-settings-tab'));
    if (FF) {
      setTabPosFF(Settings.$tabs);
    }
    document.querySelector('header .active').classList.remove('active');
    document
      .querySelector(
        "header [data-tab='" + db.get('selected-settings-tab') + "']"
      )
      .classList.add('active');
    document.querySelector('body').style.display = 'block';

    Settings.showPage();

    Settings.$permissionFilter.addEventListener('focus', function(e) {
      Settings.permissionItems = document.querySelectorAll(
        '#permissions-list li'
      );
    });
    Settings.$permissionFilter.addEventListener('keyup', function(e) {
      var key,
        val = Settings.$permissionFilter.value;
      if (val === Settings.lastFilter) {
        return;
      }

      if (val.length === 1) {
        Settings.$permissionsList.classList.add('filtered');
        Settings.$permissionFilterClear.style.display = 'block';
      }
      if (val.length === 0) {
        Settings.$permissionsList.classList.remove('filtered');
        Settings.$permissionFilterClear.style.display = 'none';
      }
      Settings.lastFilter = val;
      for (key in Settings.permissionItems) {
        if (Settings.permissionItems.hasOwnProperty(key)) {
          if (Settings.permissionItems[key].id.indexOf(val) !== -1) {
            Settings.permissionItems[key].classList.add('filter');
          } else if (!!Settings.permissionItems[key].classList) {
            Settings.permissionItems[key].classList.remove('filter');
          }
        }
      }
    });

    Settings.$permissionFilterClear.addEventListener('click', function(e) {
      Settings.$permissionFilterClear.style.display = 'none';
      Settings.$permissionFilter.value = '';
      Settings.$permissionsList.classList.remove('filtered');
    });

    Settings.$showRightClickButton.addEventListener('click', function(e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('showRightClickButton') !== 'true',
        'toggle-right-click-button'
      );
      TogglButton.toggleRightClickButton(
        localStorage.getItem('showRightClickButton') !== 'true'
      );
    });
    Settings.$startAutomatically.addEventListener('click', function(e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('startAutomatically') !== 'true',
        'toggle-start-automatically'
      );
    });
    Settings.$stopAutomatically.addEventListener('click', function(e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('stopAutomatically') !== 'true',
        'toggle-stop-automatically'
      );
    });
    Settings.$postPopup.addEventListener('click', function(e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('showPostPopup') !== 'true',
        'toggle-popup'
      );
    });
    Settings.$nanny.addEventListener('click', function(e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('nannyCheckEnabled') !== 'true',
        'toggle-nanny'
      );
    });
    Settings.$idleDetection.addEventListener('click', function(e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('idleDetectionEnabled') !== 'true',
        'toggle-idle'
      );
    });
    Settings.$pomodoroMode.addEventListener('click', function(e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('pomodoroModeEnabled') !== 'true',
        'toggle-pomodoro'
      );
    });
    Settings.$pomodoroSound.addEventListener('click', function(e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('pomodoroSoundEnabled') !== 'true',
        'toggle-pomodoro-sound'
      );
    });
    Settings.$pomodoroStopTimeTracking.addEventListener('click', function(e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('pomodoroStopTimeTrackingWhenTimerEnds') !==
          'true',
        'toggle-pomodoro-stop-time'
      );
    });

    Settings.$stopAtDayEnd.addEventListener('click', function(e) {
      Settings.toggleSetting(
        e.target,
        localStorage.getItem('stopAtDayEnd') !== 'true',
        'toggle-stop-at-day-end'
      );
    });

    Settings.$rememberProjectPer.addEventListener('change', function(e) {
      var rememberPer =
        Settings.$rememberProjectPer.options[
          Settings.$rememberProjectPer.selectedIndex
        ].value;
      if (rememberPer === 'false') {
        rememberPer = false;
      }
      Settings.saveSetting(rememberPer, 'change-remember-project-per');
    });

    document.querySelector('.tab-links').addEventListener('click', function(e) {
      document.querySelector('header .active').classList.remove('active');
      e.target.classList.add('active');
      Settings.$tabs.setAttribute(
        'data-tab',
        e.target.getAttribute('data-tab')
      );
      Settings.saveSetting(
        e.target.getAttribute('data-tab'),
        'update-selected-settings-tab'
      );
      if (FF) {
        setTabPosFF(Settings.$tabs);
      }
    });

    Settings.$pomodoroVolume.addEventListener('input', function(e) {
      Settings.$pomodoroVolumeLabel.textContent = e.target.value + '%';
    });

    Settings.$pomodoroVolume.addEventListener('change', function(e) {
      Settings.saveSetting(
        e.target.value / 100,
        'update-pomodoro-sound-volume'
      );
      Settings.$pomodoroVolumeLabel.textContent = e.target.value + '%';
    });

    document
      .querySelector('#sound-test')
      .addEventListener('click', function(e) {
        var sound = new Audio();
        sound.src = '../' + db.get('pomodoroSoundFile');
        sound.volume = Settings.$pomodoroVolume.value / 100;
        sound.play();
      });

    document
      .querySelector('#nag-nanny-from')
      .addEventListener('blur', function(e) {
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
      .addEventListener('blur', function(e) {
        if (e.target.value.length === 0) {
          Settings.setFromTo();
          return;
        }
        var fromTo =
          document.querySelector('#nag-nanny-from').value +
          '-' +
          e.target.value;
        Settings.saveSetting(fromTo, 'toggle-nanny-from-to');
      });
    document
      .querySelector('#nag-nanny-interval')
      .addEventListener('blur', function(e) {
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
      .addEventListener('blur', function(e) {
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
      .addEventListener('blur', function(e) {
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
      function(e) {
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
      .addEventListener('click', function(e) {
        var disableChecked = document.querySelector(
          '#disable-permission-notice'
        ).checked;
        db.set('dont-show-permissions', disableChecked);
        document.querySelector('.guide-container').style.display = 'none';
        document.querySelector(
          ".guide > div[data-id='" + e.target.getAttribute('data-id') + "']"
        ).style.display =
          'none';
      });

    if (FF) {
      window.onresize = function(event) {
        w = window.innerWidth;
        document.querySelector('.tab-1').style.width = w + 'px';
        document.querySelector('.tab-2').style.width = w + 'px';
        document.querySelector('.tab-3').style.width = w + 'px';
        Settings.$tabs.style.width = (w + 20) * 3 + 'px';
        setTabPosFF(Settings.$tabs);
      };
      Settings.$tabs.style.width = (w + 20) * 3 + 'px';
    }

    Settings.loadSitesIntoList();
  } catch (err) {
    chrome.runtime.sendMessage({
      type: 'error',
      stack: err.stack,
      category: 'Settings'
    });
  }
});
