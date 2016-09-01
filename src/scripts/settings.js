/*jslint indent: 2, unparam: true, plusplus: true*/
/*global navigator: false, alert: false, document: false, window: false, TogglOrigins: false, Audio: false, XMLHttpRequest: false, chrome: false, btoa: false, localStorage:false */
"use strict";

var TogglButton = chrome.extension.getBackgroundPage().TogglButton,
  Db = chrome.extension.getBackgroundPage().Db,
  FF = navigator.userAgent.indexOf("Chrome") === -1,
  w = window.innerWidth;

if (FF) {
  document.querySelector("html").classList.add("ff");
}

var Settings = {
  $startAutomatically: null,
  $stopAutomatically: null,
  $showRightClickButton: null,
  $postPopup: null,
  $nanny: null,
  $pomodoroMode: null,
  $pomodoroSound: null,
  lastFilter: null,
  $permissionFilter: document.querySelector("#permission-filter"),
  $permissionFilterClear: document.querySelector("#filter-clear"),
  permissionItems: [],
  $permissionsList: document.querySelector("#permissions-list"),
  $customPermissionsList: document.querySelector("#custom-permissions-list"),
  $newPermission: document.querySelector("#new-permission"),
  $originsSelect: document.querySelector("#origins"),
  origins: [],
  $pomodoroStopTimeTracking: null,
  $stopAtDayEnd: null,
  $tabs: null,
  $defaultProject: null,
  $pomodoroVolume: null,
  $pomodoroVolumeLabel: null,
  showPage: function () {
    var key, project, clientName, projects, clients, selected, volume = parseInt((Db.get("pomodoroSoundVolume") * 100), 10),
      defProject;

    if (!TogglButton) {
      TogglButton = chrome.extension.getBackgroundPage().TogglButton;
    }

    document.querySelector("#version").innerHTML = "<a href='http://toggl.github.io/toggl-button' title='Change log'>(" + chrome.runtime.getManifest().version + ")</a>";
    Settings.setFromTo();
    document.querySelector("#nag-nanny-interval").value = Db.get("nannyInterval") / 60000;
    Settings.$pomodoroVolume.value = volume;
    Settings.$pomodoroVolumeLabel.innerHTML = volume + "%";
    Settings.toggleState(Settings.$showRightClickButton, Db.get("showRightClickButton"));
    Settings.toggleState(Settings.$startAutomatically, Db.get("startAutomatically"));
    Settings.toggleState(Settings.$stopAutomatically, Db.get("stopAutomatically"));
    Settings.toggleState(Settings.$postPopup, Db.get("showPostPopup"));
    Settings.toggleState(Settings.$nanny, Db.get("nannyCheckEnabled"));
    Settings.toggleState(Settings.$idleDetection, Db.get("idleDetectionEnabled"));
    Settings.toggleState(Settings.$pomodoroMode, Db.get("pomodoroModeEnabled"));
    Settings.toggleState(Settings.$pomodoroSound, Db.get("pomodoroSoundEnabled"));
    Settings.toggleState(Settings.$pomodoroStopTimeTracking, Db.get("pomodoroStopTimeTrackingWhenTimerEnds"));

    document.querySelector("#pomodoro-interval").value = Db.get("pomodoroInterval");

    Settings.toggleState(Settings.$stopAtDayEnd, Db.get("stopAtDayEnd"));
    document.querySelector("#day-end-time").value = Db.get("dayEndTime");
    if (Db.get("projects") !== '') {
      projects = JSON.parse(Db.get("projects"));
      clients = JSON.parse(Db.get("clients"));
      Settings.$defaultProject.innerHTML = '<option value="0">- No project -</option>';
      for (key in projects) {
        if (projects.hasOwnProperty(key)) {
          selected = '';
          project = projects[key];
          clientName = (!!project.cid && !!clients[project.cid]) ? ' . ' + clients[project.cid].name  : '';
          defProject = Db.get(TogglButton.$user.id + "-defaultProject");
          if (!!defProject && parseInt(defProject, 10) === project.id) {
            selected = "selected ";
          }
          Settings.$defaultProject.innerHTML += "<option " + selected + "value='" + project.id + "'>" + project.name + clientName + "</option>";
        }
      }
    }
    TogglButton.analytics("settings", null);
    if (!FF) {
      Settings.loadSitesIntoList();
    }
  },
  getAllPermissions: function () {
    var items = document.querySelectorAll("#permissions-list li input"),
      urls = [],
      i,
      current;

    for (i = 0; i < items.length; i++) {
      current = items[i].getAttribute("data-host");
      if (current.indexOf("toggl") === -1) {
        urls.push(current);
      }
    }

    return {origins: urls};
  },
  setFromTo: function () {
    var fromTo = Db.get("nannyFromTo").split("-");
    document.querySelector("#nag-nanny-from").value = fromTo[0];
    document.querySelector("#nag-nanny-to").value = fromTo[1];
  },
  toggleState: function (elem, state) {
    elem.checked = state;
  },
  toggleSetting: function (elem, state, type) {
    var request = {
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
    var html = "",
      html_list = "",
      custom_html = "",
      url,
      name,
      i,
      k,
      origins,
      disabled,
      checked,
      customs,
      tmpkey;

    // Load permissions list
    chrome.permissions.getAll(function (results) {
      var key;
      Settings.origins = [];
      origins = results.origins;
      for (i = 0; i < origins.length; i++) {
        name = url = origins[i].replace("*://*.", "").replace("*://", "").replace("/*", "");
        if (url.split(".").length > 2) {
          name = url.substr(url.indexOf(".") + 1);
        }
        Settings.origins[name] = {
          id: i,
          origin: origins[i],
          url: url,
          name: name
        };
      }

      for (key in TogglOrigins) {
        if (TogglOrigins.hasOwnProperty(key)) {
          disabled = '';
          checked = 'checked';

          if (!Settings.origins[key]) {
            // Handle cases where subdomain is used (like web.any.do, we remove web from the beginning)
            tmpkey = key.split(".");
            tmpkey.shift();
            tmpkey = tmpkey.join(".");
            if (!Settings.origins[tmpkey]) {
              disabled = 'class="disabled"';
              checked = '';
            }
          }

          // Don't display all different urls for 1 service
          if (!TogglOrigins[key].clone) {
            html += "<option id='origin' data-id='" + i + "' value='" + key + "'>" + TogglOrigins[key].name + "</option>";
          }

          // Don't show toggl.com as it's not optional
          if (key.indexOf("toggl") === -1 && !!TogglOrigins[key].url) {
            html_list += '<li ' + disabled + ' id="' + key + '"><input type="checkbox" class="toggle" data-host="' + TogglOrigins[key].url + '" ' + checked + '><div>' + key + '</div></li>';
          }
        }
      }

      document.querySelector("#origins").innerHTML = html;
      Settings.$permissionsList.innerHTML = html_list;
    });

    // Load Custom Permissions list
    customs = Db.getAllOrigins();
    for (k in customs) {
      if (customs.hasOwnProperty(k)) {
        custom_html += "<li><a class='remove-custom'>&times;</a><strong>" + k + "</strong> - <i>" + customs[k] + "</i></li>";
      }
    }
    Settings.$customPermissionsList.innerHTML = custom_html;
  }
};

document.addEventListener('DOMContentLoaded', function (e) {
  Settings.$pomodoroVolume = document.querySelector("#sound-volume");
  Settings.$pomodoroVolumeLabel = document.querySelector("#volume-label");
  Settings.$startAutomatically = document.querySelector("#start_automatically");
  Settings.$stopAutomatically = document.querySelector("#stop_automatically");
  Settings.$showRightClickButton = document.querySelector("#show_right_click_button");
  Settings.$postPopup = document.querySelector("#show_post_start_popup");
  Settings.$nanny = document.querySelector("#nag-nanny");
  Settings.$idleDetection = document.querySelector("#idle-detection");
  Settings.$pomodoroMode = document.querySelector("#pomodoro-mode");
  Settings.$pomodoroSound = document.querySelector("#enable-sound-signal");
  Settings.$pomodoroStopTimeTracking = document.querySelector("#pomodoro-stop-time");
  Settings.$stopAtDayEnd = document.querySelector("#stop-at-day-end");
  Settings.$tabs = document.querySelector(".tabs");
  Settings.$defaultProject = document.querySelector("#default-project");

  // Show permissions page with notice
  if (!!parseInt(Db.get("show-permissions-info"), 10) && !Db.get("dont-show-permissions")) {
    document.querySelector(".guide-container").style.display = "block";
    document.querySelector(".guide > div[data-id='" + Db.get("show-permissions-info") + "']").style.display = "block";
    Db.set("show-permissions-info", 0);
  }

  // Set selected tab
  Settings.$tabs.setAttribute("data-tab", Db.get("selected-settings-tab"));
  if (FF) {
    if (Settings.$tabs.getAttribute("data-tab") === "1") {
      Settings.$tabs.style.left = "0";
    } else {
      Settings.$tabs.style.left = "-" + (w + 15) + "px";
    }
  }
  document.querySelector("header .active").classList.remove("active");
  document.querySelector("header [data-tab='" + Db.get("selected-settings-tab") + "']").classList.add("active");
  document.querySelector("body").style.display = "block";

  Settings.showPage();

  Settings.$permissionFilter.addEventListener('focus', function (e) {
    Settings.permissionItems = document.querySelectorAll("#permissions-list li");
  });
  Settings.$permissionFilter.addEventListener('keyup', function (e) {
    var key, val = Settings.$permissionFilter.value;
    if (val === Settings.lastFilter) {
      return;
    }

    if (val.length === 1) {
      Settings.$permissionsList.classList.add("filtered");
      Settings.$permissionFilterClear.style.display = "block";
    }
    if (val.length === 0) {
      Settings.$permissionsList.classList.remove("filtered");
      Settings.$permissionFilterClear.style.display = "none";
    }
    Settings.lastFilter = val;
    for (key in Settings.permissionItems) {
      if (Settings.permissionItems.hasOwnProperty(key)) {
        if (Settings.permissionItems[key].id.indexOf(val) !== -1) {
          Settings.permissionItems[key].classList.add("filter");
        } else if (!!Settings.permissionItems[key].classList) {
          Settings.permissionItems[key].classList.remove("filter");
        }
      }
    }
  });

  Settings.$permissionFilterClear.addEventListener('click', function (e) {
    Settings.$permissionFilterClear.style.display = "none";
    Settings.$permissionFilter.value = "";
    Settings.$permissionsList.classList.remove("filtered");
  });

  Settings.$showRightClickButton.addEventListener('click', function (e) {
    Settings.toggleSetting(e.target, (localStorage.getItem("showRightClickButton") !== "true"), "toggle-right-click-button");
    TogglButton.toggleRightClickButton((localStorage.getItem("showRightClickButton") !== "true"));
  });
  Settings.$startAutomatically.addEventListener('click', function (e) {
    Settings.toggleSetting(e.target, (localStorage.getItem("startAutomatically") !== "true"), "toggle-start-automatically");
  });
  Settings.$stopAutomatically.addEventListener('click', function (e) {
    Settings.toggleSetting(e.target, (localStorage.getItem("stopAutomatically") !== "true"), "toggle-stop-automatically");
  });
  Settings.$postPopup.addEventListener('click', function (e) {
    Settings.toggleSetting(e.target, (localStorage.getItem("showPostPopup") !== "true"), "toggle-popup");
  });
  Settings.$nanny.addEventListener('click', function (e) {
    Settings.toggleSetting(e.target, (localStorage.getItem("nannyCheckEnabled") !== "true"), "toggle-nanny");
  });
  Settings.$idleDetection.addEventListener('click', function (e) {
    Settings.toggleSetting(e.target, (localStorage.getItem("idleDetectionEnabled") !== "true"), "toggle-idle");
  });
  Settings.$pomodoroMode.addEventListener('click', function (e) {
    Settings.toggleSetting(e.target, (localStorage.getItem("pomodoroModeEnabled") !== "true"), "toggle-pomodoro");
  });
  Settings.$pomodoroSound.addEventListener('click', function (e) {
    Settings.toggleSetting(e.target, (localStorage.getItem("pomodoroSoundEnabled") !== "true"), "toggle-pomodoro-sound");
  });
  Settings.$pomodoroStopTimeTracking.addEventListener('click', function (e) {
    Settings.toggleSetting(e.target, (localStorage.getItem("pomodoroStopTimeTrackingWhenTimerEnds") !== "true"), "toggle-pomodoro-stop-time");
  });
  Settings.$defaultProject.addEventListener('change', function (e) {
    var defaultProject = Settings.$defaultProject.options[Settings.$defaultProject.selectedIndex].value;
    Settings.saveSetting(defaultProject, "change-default-project");
  });

  Settings.$stopAtDayEnd.addEventListener('click', function (e) {
    Settings.toggleSetting(e.target, (localStorage.getItem("stopAtDayEnd") !== "true"), "toggle-stop-at-day-end");
  });

  document.querySelector(".tab-links").addEventListener('click', function (e) {
    document.querySelector("header .active").classList.remove("active");
    e.target.classList.add("active");
    Settings.$tabs.setAttribute("data-tab", e.target.getAttribute("data-tab"));
    Settings.saveSetting(e.target.getAttribute("data-tab"), "update-selected-settings-tab");
    if (FF) {
      if (e.target.getAttribute("data-tab") === "1") {
        Settings.$tabs.style.left = "0";
      } else {
        Settings.$tabs.style.left = "-" + (w + 15) + "px";
      }
    }
  });

  Settings.$pomodoroVolume.addEventListener('input', function (e) {
    Settings.$pomodoroVolumeLabel.innerHTML = e.target.value + "%";
  });

  Settings.$pomodoroVolume.addEventListener('change', function (e) {
    Settings.saveSetting(e.target.value / 100, "update-pomodoro-sound-volume");
    Settings.$pomodoroVolumeLabel.innerHTML = e.target.value + "%";
  });

  document.querySelector("#sound-test").addEventListener('click', function (e) {
    var sound = new Audio();
    sound.src = "../" + Db.get("pomodoroSoundFile");
    sound.volume = Settings.$pomodoroVolume.value / 100;
    sound.play();
  });

  document.querySelector("#nag-nanny-from").addEventListener('blur', function (e) {
    if (e.target.value.length === 0) {
      Settings.setFromTo();
      return;
    }
    Settings.$fromTo = e.target.value + "-" + document.querySelector('#nag-nanny-to').value;
    Settings.saveSetting();
  });
  document.querySelector("#nag-nanny-to").addEventListener('blur', function (e) {
    if (e.target.value.length === 0) {
      Settings.setFromTo();
      return;
    }
    var fromTo = document.querySelector('#nag-nanny-from').value + "-" + e.target.value;
    Settings.saveSetting(fromTo, "toggle-nanny-from-to");
  });
  document.querySelector("#nag-nanny-interval").addEventListener('blur', function (e) {
    if (e.target.value < 1) {
      e.target.value = 1;
      return;
    }
    Settings.saveSetting((document.querySelector('#nag-nanny-interval').value * 60000), "toggle-nanny-interval");

  });

  document.querySelector("#pomodoro-interval").addEventListener('blur', function (e) {
    if (e.target.value < 1) {
      e.target.value = 1;
      return;
    }
    Settings.saveSetting(+(document.querySelector('#pomodoro-interval').value), "toggle-pomodoro-interval");

  });

  // Enable/Disable origin permissions
  document.querySelector('#permissions-list').addEventListener('click', function (e) {
    var permission,
      target = e.target;

    if (e.target.tagName !== "INPUT") {
      target = e.target.querySelector("input");
      target.checked = !target.checked;
    }

    permission = {origins: [target.getAttribute("data-host")]};

    if (target.checked) {
      chrome.permissions.request(permission, function (result) {
        if (result) {
          target.parentNode.classList.remove("disabled");
        } else {
          target.checked = false;
        }
      });
    } else {
      chrome.permissions.contains(permission, function (allowed) {
        if (allowed) {
          chrome.permissions.remove(permission, function (result) {
            if (result) {
              target.parentNode.classList.add("disabled");
            } else {
              target.checked = true;
            }
          });
        } else {
          alert('No "' + Settings.origins[target.getAttribute("data-id")] + '" host permission found.');
        }
      });
    }
  });

  // Enable all predefined origins
  document.querySelector('.enable-all').addEventListener('click', function (e) {
    chrome.permissions.request(Settings.getAllPermissions(), function (result) {
      if (result) {
        Settings.loadSitesIntoList();
      }
    });
  });

  // Disable all predefined origins
  document.querySelector('.disable-all').addEventListener('click', function (e) {
    chrome.permissions.remove(Settings.getAllPermissions(), function (result) {
      if (result) {
        Settings.loadSitesIntoList();
      }
    });
  });

  // Add custom permission (custom domain)
  document.querySelector('#add-permission').addEventListener('click', function (e) {
    var text = Settings.$newPermission.value,
      domain,
      permission,
      o = Settings.$originsSelect;

    if (text.indexOf(":") !== -1) {
      text = text.split(":")[0];
    }
    if (text.indexOf("//") !== -1) {
      text = text.split("//")[1];
    }

    Settings.$newPermission.value = text;
    domain = "*://" + Settings.$newPermission.value + "/";
    permission = {origins: [domain]};

    chrome.permissions.request(permission, function (result) {
      if (result) {
        Db.setOrigin(Settings.$newPermission.value, o.value);
        Settings.$newPermission.value = "";
      }
      Settings.loadSitesIntoList();
      if (result) {
        document.location.hash = domain;
      }
    });
  });

  document.querySelector('#custom-permissions-list').addEventListener('click', function (e) {
    var custom, domain, permission, parent;
    if (e.target.className === "remove-custom") {
      parent = e.target.parentNode;
      custom = parent.querySelector('strong').textContent;
      domain = "*://" + custom + "/";
      permission = {origins: [domain]};

      chrome.permissions.contains(permission, function (allowed) {
        if (allowed) {
          chrome.permissions.remove(permission, function (result) {
            if (result) {
              Db.removeOrigin(custom);
              parent.remove();
            } else {
              alert("Fail");
            }
          });
        } else {
          alert('No "' + custom + '" host permission found.');
        }
      });

    }
    return false;
  });

  document.querySelector("#day-end-time").addEventListener('blur', function (e) {
    if (e.target.value < 1) {
      e.target.value = 1;
      return;
    }
    Settings.saveSetting((document.querySelector('#day-end-time').value), "toggle-day-end-time");
  });

  document.querySelector(".container").addEventListener("transitionend", function (e) {
    if (e.propertyName === "height"
        && e.target.className === "subsettings-details"
        && e.target.clientHeight > 0) {
      e.target.scrollIntoView();
    }
  }, false);

  document.querySelector(".guide button").addEventListener('click', function (e) {
    var disableChecked = document.querySelector("#disable-permission-notice").checked;
    Db.set("dont-show-permissions", disableChecked);
    document.querySelector(".guide-container").style.display = "none";
    document.querySelector(".guide > div[data-id='" + Db.get("show-permissions-info") + "']").style.display = "none";
  });

  if (FF) {
    window.onresize = function (event) {
      w = window.innerWidth;
      document.querySelector(".tab-1").style.width = w + "px";
      document.querySelector(".tab-2").style.width = w + "px";
    };
  }

});
