/*jslint indent: 2, unparam: true*/
/*global AutoComplete: false, ProjectAutoComplete: false, TagAutoComplete: false, navigator: false, document: false, window: false, XMLHttpRequest: false, chrome: false, btoa: false, localStorage:false */
"use strict";

var TogglButton = chrome.extension.getBackgroundPage().TogglButton,
  Db = chrome.extension.getBackgroundPage().Db,
  FF = navigator.userAgent.indexOf("Chrome") === -1;

if (FF) {
  document.querySelector("body").classList.add("ff");
}

var PopUp = {
  $postStartText: " post-start popup",
  $popUpButton: null,
  $togglButton: document.querySelector(".stop-button"),
  $resumeButton: document.querySelector(".resume-button"),
  $errorLabel: document.querySelector(".error"),
  $editButton: document.querySelector(".edit-button"),
  $projectBullet: document.querySelector(".timer .project-bullet"),
  $projectAutocomplete: null,
  $tagAutocomplete: null,
  $timerRow: document.querySelector(".timer"),
  $timer: null,
  $tagsVisible: false,
  mousedownTrigger: null,
  projectBlurTrigger: null,
  editFormAdded: false,
  $header: document.querySelector(".header"),
  $menuView: document.querySelector("#menu"),
  $editView: document.querySelector("#entry-form"),
  $loginView: document.querySelector("#login-form"),
  defaultErrorMessage: "Error connecting to server",
  showPage: function () {
    var p;
    if (!TogglButton) {
      TogglButton = chrome.extension.getBackgroundPage().TogglButton;
    }

    if (TogglButton.$user !== null) {
      if (!PopUp.editFormAdded) {
        PopUp.$editView.innerHTML = TogglButton.getEditForm();
        PopUp.addEditEvents();
        PopUp.editFormAdded = true;
      }
      document.querySelector(".header .icon").setAttribute("title", "Open toggl.com - " + TogglButton.$user.email);
      PopUp.$timerRow.classList.remove("has-resume");
      if (TogglButton.$curEntry === null) {
        PopUp.$togglButton.setAttribute('data-event', 'timeEntry');
        PopUp.$togglButton.textContent = 'Start new';
        PopUp.$togglButton.parentNode.classList.remove('tracking');
        PopUp.$projectBullet.className = "project-bullet";
        if (TogglButton.$latestStoppedEntry) {
          p = TogglButton.findProjectByPid(TogglButton.$latestStoppedEntry.pid);
          p = (!!p) ? " - " + p.name : "";
          PopUp.$resumeButton.title = TogglButton.$latestStoppedEntry.description + p;
          PopUp.$timerRow.classList.add("has-resume");
          localStorage.setItem('latestStoppedEntry', JSON.stringify(TogglButton.$latestStoppedEntry));
          PopUp.$resumeButton.setAttribute('data-event', 'resume');
        }
      } else {
        PopUp.$togglButton.setAttribute('data-event', 'stop');
        PopUp.$togglButton.textContent = 'Stop';
        PopUp.$togglButton.parentNode.classList.add('tracking');
        PopUp.showCurrentDuration(true);
      }
      if (!PopUp.$header.getAttribute("data-view")) {
        PopUp.switchView(PopUp.$menuView);
      }
    } else {
      localStorage.setItem('latestStoppedEntry', '');
      PopUp.switchView(PopUp.$loginView);
    }
  },

  sendMessage: function (request) {
    chrome.runtime.sendMessage(request, function (response) {
      if (!response) {
        return;
      }
      if (!!response.success) {
        if (!!response.type && response.type === "New Entry" && Db.get("showPostPopup")) {
          PopUp.updateEditForm(PopUp.$editView);
        } else if (response.type === "Update") {
          TogglButton = chrome.extension.getBackgroundPage().TogglButton;
        } else {
          window.location.reload();
        }
      } else if (request.type === "login"
          || (!!response.type &&
            (response.type === "New Entry" || response.type === "Update"))) {
        PopUp.showError(response.error || PopUp.defaultErrorMessage);
      }
    });
  },

  showError: function (errorMessage) {
    PopUp.$errorLabel.innerHTML = errorMessage;
    PopUp.$errorLabel.classList.add("show");
    setTimeout(function () { PopUp.$errorLabel.classList.remove("show"); }, 3000);
  },

  showCurrentDuration: function (startTimer) {
    if (TogglButton.$curEntry === null) {
      PopUp.$togglButton.setAttribute('data-event', 'timeEntry');
      PopUp.$togglButton.setAttribute('title', '');
      PopUp.$togglButton.textContent = 'Start new';
      PopUp.$togglButton.parentNode.classList.remove('tracking');
      clearInterval(PopUp.$timer);
      PopUp.$timer = null;
      PopUp.$projectBullet.className = "project-bullet";
      return;
    }

    var duration = PopUp.msToTime(new Date() - new Date(TogglButton.$curEntry.start)),
      description = TogglButton.$curEntry.description || "(no description)";

    PopUp.$togglButton.textContent = duration;
    if (startTimer) {
      PopUp.$timer = setInterval(function () { PopUp.showCurrentDuration(); }, 1000);
      description += PopUp.$projectAutocomplete.setProjectBullet(TogglButton.$curEntry.pid, TogglButton.$curEntry.tid, PopUp.$projectBullet);
      PopUp.$editButton.textContent = description;
      PopUp.$editButton.setAttribute('title', 'Click to edit "' + description + '"');
    }
  },

  updateMenuTimer: function (desc, pid, tid) {
    var description = desc || "(no description)";

    description += PopUp.$projectAutocomplete.setProjectBullet(pid, tid, PopUp.$projectBullet);
    PopUp.$editButton.textContent = description;
    PopUp.$editButton.setAttribute('title', 'Click to edit "' + description + '"');
  },

  switchView: function (view) {
    PopUp.$header.setAttribute("data-view", view.id);
  },

  formatMe: function (n) {
    return (n < 10) ? '0' + n : n;
  },

  msToTime: function (duration) {
    var seconds = parseInt((duration / 1000) % 60, 10),
      minutes = parseInt((duration / (1000 * 60)) % 60, 10),
      hours = parseInt((duration / (1000 * 60 * 60)), 10);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  },

  /* Edit form functions */
  updateEditForm: function (view) {
    var pid = (!!TogglButton.$curEntry.pid) ? TogglButton.$curEntry.pid : 0,
      tid = (!!TogglButton.$curEntry.tid) ? TogglButton.$curEntry.tid : 0,
      togglButtonDescription = document.querySelector("#toggl-button-description");

    togglButtonDescription.value = (!!TogglButton.$curEntry.description) ? TogglButton.$curEntry.description : "";

    PopUp.$projectAutocomplete.setup(pid, tid);
    PopUp.$tagAutocomplete.setup(TogglButton.$curEntry.tags);
    PopUp.switchView(view);

    // Put focus to the beginning of desctiption field
    togglButtonDescription.focus();
    togglButtonDescription.setSelectionRange(0, 0);
    togglButtonDescription.scrollLeft = 0;
  },

  submitForm: function (that) {
    var selected = PopUp.$projectAutocomplete.getSelected(),
      request = {
        type: "update",
        description: document.querySelector("#toggl-button-description").value,
        pid: selected.pid,
        projectName: selected.name,
        tags: PopUp.$tagAutocomplete.getSelected(),
        tid: selected.tid,
        respond: true,
        service: "dropdown"
      };
    PopUp.sendMessage(request);
    PopUp.updateMenuTimer(request.description, request.pid, request.tid);
    PopUp.switchView(PopUp.$menuView);
  },

  addEditEvents: function () {
    /* Edit form events */
    PopUp.$projectAutocomplete = new ProjectAutoComplete("project", "li", PopUp);
    PopUp.$tagAutocomplete = new TagAutoComplete("tag", "li", PopUp);

    document.querySelector("#toggl-button-update").addEventListener('click', function (e) {
      PopUp.submitForm(this);
    });

    document.querySelector("#entry-form form").addEventListener('submit', function (e) {
      PopUp.submitForm(this);
      e.preventDefault();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  var onClickSendMessage,
    req = {
      type: "sync",
      respond: false
    };

  PopUp.sendMessage(req);
  PopUp.showPage();
  PopUp.$editButton.addEventListener('click', function () {
    PopUp.updateEditForm(PopUp.$editView);
  });
  onClickSendMessage = function () {
    var request = {
      type: this.getAttribute('data-event'),
      respond: true,
      service: "dropdown"
    };
    clearInterval(PopUp.$timer);
    PopUp.$timer = null;

    PopUp.sendMessage(request);
  };
  PopUp.$togglButton.addEventListener('click', onClickSendMessage);
  PopUp.$resumeButton.addEventListener('click', onClickSendMessage);

  document.querySelector(".header .cog").addEventListener('click', function () {
    var request = {
      type: "options",
      respond: false
    };

    chrome.runtime.sendMessage(request);
  });

  document.querySelector(".header .logout").addEventListener('click', function () {
    var request = {
      type: "logout",
      respond: true
    };
    PopUp.sendMessage(request);
  });

  document.querySelector(".header .sync").addEventListener('click', function () {
    var request = {
      type: "sync",
      respond: false
    };
    PopUp.sendMessage(request);
    window.close();
  });

  document.querySelector("#signin").addEventListener('submit', function (event) {
    event.preventDefault();
    PopUp.$errorLabel.classList.remove("show");
    var request = {
      type: "login",
      respond: true,
      username: document.querySelector("#login_email").value,
      password: document.querySelector("#login_password").value
    };
    PopUp.sendMessage(request);
  });

  document.querySelector(".header .icon").addEventListener('click', function () {
    chrome.tabs.create({url: "https://toggl.com/app"});
  });
});
