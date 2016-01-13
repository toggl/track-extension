/*jslint indent: 2, unparam: true*/
/*global document: false, window: false, XMLHttpRequest: false, chrome: false, btoa: false, localStorage:false */
"use strict";

var TogglButton = chrome.extension.getBackgroundPage().TogglButton;
var Db = chrome.extension.getBackgroundPage().Db;

var Settings = {
  $postPopup: null,
  $socket: null,
  $nanny: null,
  $pomodoroMode: null,
  $pomodoroSound: null,
  $permissionsList: document.querySelector("#permissions-list"),
  $newPermission: document.querySelector("#new-permission"),
  $originsSelect: document.querySelector("#origins"),
  origins: [],
  showPage: function () {
    document.querySelector("#version").innerHTML = "<a href='http://toggl.github.io/toggl-button' title='Change log'>(" + chrome.runtime.getManifest().version + ")</a>";
    Settings.setFromTo();
    document.querySelector("#nag-nanny-interval").value = Db.get("nannyInterval") / 60000;
    Settings.toggleState(Settings.$postPopup, Db.get("showPostPopup"));
    Settings.toggleState(Settings.$nanny, Db.get("nannyCheckEnabled"));
    Settings.toggleSetting(Settings.$socket, Db.get("socketEnabled") && TogglButton.$socket);
    Settings.toggleState(Settings.$idleDetection, Db.get("idleDetectionEnabled"));
    Settings.toggleState(Settings.$pomodoroMode, Db.get("pomodoroModeEnabled"));
    Settings.toggleState(Settings.$pomodoroSound, Db.get("pomodoroSoundEnabled"));
    document.querySelector("#pomodoro-interval").value = Db.get("pomodoroInterval");

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
      url, name,
      i, key,
      origins,
      disabled,
      checked;

    chrome.permissions.getAll(function (results) {
      origins = results.origins;
      console.log("origins: ALL("+Object.keys(TogglOrigins).length+ ") | Enabled ("+origins.length+")");
      for (i = 0; i < origins.length; i++) {
        name = url = origins[i].replace("*://*.", "").replace("*://", "").replace("/*", "");
        if (url.split(".").length > 2) {
          name = url.substr(url.indexOf(".")+1)
        }
        console.log("name: " + name);
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

          html += "<option id='origin' data-id='" + i + "' value='" + Settings.origins[key].url + "'>" + Settings.origins[key].name + "</option>";
          html_list += '<li ' + disabled + ' id="' + key + '"><input type="checkbox" data-host="' + TogglOrigins[key] + '" ' + checked + '><div>' + key + '</div></li>';
        }
      }

      document.querySelector("#origins").innerHTML = html;
      Settings.$permissionsList.innerHTML = html_list;
    });
  }
};

document.addEventListener('DOMContentLoaded', function (e) {
  Settings.$postPopup = document.querySelector("#show_post_start_popup");
  Settings.$socket = document.querySelector("#websocket");
  Settings.$nanny = document.querySelector("#nag-nanny");
  Settings.$idleDetection = document.querySelector("#idle-detection");
  Settings.$pomodoroMode = document.querySelector("#pomodoro-mode");
  Settings.$pomodoroSound = document.querySelector("#enable-sound-signal");
  Settings.showPage();

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

  document.querySelector(".tab-links").addEventListener('click', function (e) {
    var tab = e.target.getAttribute("data-tab");
    if (!document.querySelector(".tab-" + tab).classList.contains("active")) {
      document.querySelector(".tab.active").classList.remove("active");
      document.querySelector("header .active").classList.remove("active");
      document.querySelector(".tab-" + tab).classList.add("active");
      e.target.classList.add("active");
    }
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
        Db.setOrigin(Settings.$newPermission.value, o.value);
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

});
