/*jslint indent: 2, unparam: true*/
/*global document: false, window: false, XMLHttpRequest: false, chrome: false, btoa: false, localStorage:false */
"use strict";

var TogglButton = chrome.extension.getBackgroundPage().TogglButton;
var Db = chrome.extension.getBackgroundPage().Db;

var Settings = {
  $startAutomatically: null,
  $stopAutomatically: null,
  $showRightClickButton: null,
  $postPopup: null,
  $socket: null,
  $nanny: null,
  $pomodoroMode: null,
  $pomodoroSound: null,
  $permissionsList: document.querySelector("#permissions-list"),
  $customPermissionsList: document.querySelector("#custom-permissions-list"),
  $newPermission: document.querySelector("#new-permission"),
  $originsSelect: document.querySelector("#origins"),
  origins: [],
  $pomodoroStopTimeTracking: null,
  $stopAtDayEnd: null,
  $tabs: null,
  $defaultProject: null,
  showPage: function () {
    var key, project, clientName, projects, clients, selected;
    document.querySelector("#version").innerHTML = "<a href='http://toggl.github.io/toggl-button' title='Change log'>(" + chrome.runtime.getManifest().version + ")</a>";
    Settings.setFromTo();
    document.querySelector("#nag-nanny-interval").value = Db.get("nannyInterval") / 60000;
    Settings.toggleState(Settings.$showRightClickButton, Db.get("showRightClickButton"));
    Settings.toggleState(Settings.$startAutomatically, Db.get("startAutomatically"));
    Settings.toggleState(Settings.$stopAutomatically, Db.get("stopAutomatically"));
    Settings.toggleState(Settings.$postPopup, Db.get("showPostPopup"));
    Settings.toggleState(Settings.$nanny, Db.get("nannyCheckEnabled"));
    Settings.toggleState(Settings.$socket, Db.get("socketEnabled"));
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
          if (parseInt(Db.get('defaultProject'), 10) === project.id) {
            selected = "selected ";
          }
          Settings.$defaultProject.innerHTML += "<option " + selected + "value='" + project.id + "'>" + project.name + clientName + "</option>";
        }
      }
    }
    TogglButton.analytics("settings", null);
    Settings.loadSitesIntoList();
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
    chrome.extension.sendMessage(request);
  },
  saveSetting: function (value, type) {
    Settings.toggleSetting(null, value, type);
  },
  loadSitesIntoList: function () {
    var html = "",
      html_list = "",
      custom_html = "",
      url, name,
      i, key,
      origins,
      disabled,
      checked,
      customs;

    // Load permissions list
    chrome.permissions.getAll(function (results) {
      origins = results.origins;
      console.log("origins: ALL("+Object.keys(TogglOrigins).length+ ") | Enabled ("+origins.length+")");
      for (i = 0; i < origins.length; i++) {
        name = url = origins[i].replace("*://*.", "").replace("*://", "").replace("/*", "");
        if (url.split(".").length > 2) {
          name = url.substr(url.indexOf(".")+1)
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
            disabled = 'class="disabled"';
            checked = '';
          }
          if (!TogglOrigins[key].clone) {
            html += "<option id='origin' data-id='" + i + "' value='" + key + "'>" + TogglOrigins[key].name + "</option>";
          }
          html_list += '<li ' + disabled + ' id="' + key + '"><input type="checkbox" data-host="' + TogglOrigins[key] + '" ' + checked + '><div>' + key + '</div></li>';
        }
      }

      document.querySelector("#origins").innerHTML = html;
      Settings.$permissionsList.innerHTML = html_list;
    });

    // Load Custom Permissions list
    customs = Db.getAllOrigins();
    for (key in customs) {
      if (customs.hasOwnProperty(key)) {
        custom_html += "<li><a class='remove-custom'>&times;</a><strong>" + key + "</strong> - <i>" + customs[key] + "</i></li>";
      }
    }
    Settings.$customPermissionsList.innerHTML = custom_html;
  }
};
document.addEventListener('DOMContentLoaded', function (e) {
  Settings.$startAutomatically = document.querySelector("#start_automatically");
  Settings.$stopAutomatically = document.querySelector("#stop_automatically");
  Settings.$showRightClickButton = document.querySelector("#show_right_click_button");
  Settings.$postPopup = document.querySelector("#show_post_start_popup");
  Settings.$socket = document.querySelector("#websocket");
  Settings.$nanny = document.querySelector("#nag-nanny");
  Settings.$idleDetection = document.querySelector("#idle-detection");
  Settings.$pomodoroMode = document.querySelector("#pomodoro-mode");
  Settings.$pomodoroSound = document.querySelector("#enable-sound-signal");
  Settings.$pomodoroStopTimeTracking = document.querySelector("#pomodoro-stop-time");
  Settings.$stopAtDayEnd = document.querySelector("#stop-at-day-end");
  Settings.$tabs = document.querySelector(".tabs");
  Settings.$defaultProject = document.querySelector("#default-project");
  Settings.showPage();
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
  Settings.$socket.addEventListener('click', function (e) {
    Settings.toggleSetting(e.target, (localStorage.getItem("socketEnabled") !== "true"), "toggle-socket");
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

// Add custom permission (custom domain)
  document.querySelector('#add-permission').addEventListener('click', function(e) {
    var domain = "*://" + Settings.$newPermission.value + "/",
      permission = {origins: [domain]},
      e = Settings.$originsSelect;

    chrome.permissions.request(permission, function(result) {
      if (result) {
        console.log(domain +" > [ " + document.querySelector("#origins").value + " ]");
        Db.setOrigin(Settings.$newPermission.value, Settings.$originsSelect.value);
        Settings.$newPermission.value = "";
      }
      Settings.loadSitesIntoList();
      if (result) {
        document.location.hash = domain;
      }
    });
  });

  document.querySelector('#permissions-list').addEventListener('click', function(e) {
    var permission = {origins: [e.target.getAttribute("data-host")]};

    if (e.target.checked) {
      chrome.permissions.request(permission, function(result) {
        if (result) {
          e.target.parentNode.classList.remove("disabled");
        }
      });
    } else {
      chrome.permissions.contains(permission, function(allowed) {
      if (allowed) {
        chrome.permissions.remove(permission, function(result) {
          if (result) {
            e.target.parentNode.classList.add("disabled");
          }
        });
      } else {
        alert('No "' + Settings.origins[e.target.getAttribute("data-id")] + '" host permission found.');
      }
    });
    }
  });

  document.querySelector('#custom-permissions-list').addEventListener('click', function(e) {
    var custom, domain, permission, parent;
    if (e.target.className === "remove-custom") {
      parent = e.target.parentNode;
      custom = parent.querySelector('strong').textContent;
      domain = "*://" + custom + "/";
      permission = {origins: [domain]};

      chrome.permissions.contains(permission, function(allowed) {
        if (allowed) {
          chrome.permissions.remove(permission, function(result) {
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
});
