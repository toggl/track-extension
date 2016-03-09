/*jslint indent: 2, unparam: true*/
/*global document: false, window: false, XMLHttpRequest: false, chrome: false, btoa: false, localStorage:false */
"use strict";

var TogglButton = chrome.extension.getBackgroundPage().TogglButton;
var Db = chrome.extension.getBackgroundPage().Db;

var PopUp = {
  $postStartText: " post-start popup",
  $popUpButton: null,
  $togglButton: document.querySelector(".stop-button"),
  $resumeButtonContainer: document.querySelector(".resume-button-container"),
  $resumeButton: document.querySelector(".resume-button"),
  $errorLabel: document.querySelector(".error"),
  $editButton: document.querySelector(".edit-button"),
  $projectBullet: document.querySelector(".project-bullet"),
  $error: document.querySelector(".error"),
  $timer: null,
  $tagsVisible: false,
  $taskBlurTrigger: null,
  mousedownTrigger: null,
  projectBlurTrigger: null,
  taskBlurTrigger: null,
  editFormAdded: false,
  $menuView: document.querySelector(".menu"),
  $editView: document.querySelector("#entry-form"),
  $loginView: document.querySelector("#login-form"),
  defaultErrorMessage: "Error connecting to server",
  showPage: function () {
    if (!TogglButton) {
      TogglButton = chrome.extension.getBackgroundPage().TogglButton;
    }

    if (TogglButton.$user !== null) {
      if (!PopUp.editFormAdded) {
        PopUp.$editView.innerHTML = TogglButton.getEditForm();
        PopUp.addEditEvents();
        PopUp.editFormAdded = true;
      }
      document.querySelector(".user-email").textContent = TogglButton.$user.email;
      PopUp.$resumeButtonContainer.style.display = "none";
      if (TogglButton.$curEntry === null) {
        PopUp.$togglButton.setAttribute('data-event', 'timeEntry');
        PopUp.$togglButton.textContent = 'Start new';
        PopUp.$togglButton.parentNode.classList.remove('tracking');
        PopUp.$projectBullet.className = "project-bullet";
        if (TogglButton.$latestStoppedEntry) {
          PopUp.$resumeButton.setAttribute('data-event', 'resume');
          PopUp.$resumeButtonContainer.style.display = "block";
        }
      } else {
        PopUp.$togglButton.setAttribute('data-event', 'stop');
        PopUp.$togglButton.textContent = 'Stop';
        PopUp.$togglButton.parentNode.classList.add('tracking');
        PopUp.showCurrentDuration(true);
      }
    } else {
      PopUp.switchView(PopUp.$loginView);
    }
  },

  sendMessage: function (request) {
    chrome.extension.sendMessage(request, function (response) {
      if (!!response.success) {
        if (!!response.type && response.type === "New Entry" && Db.get("showPostPopup")) {
          PopUp.updateEditForm(PopUp.$editView);
        } else if (response.type === "Update") {
          TogglButton = chrome.extension.getBackgroundPage().TogglButton;
        } else {
          window.location.reload();
        }
      } else if (request.type === "login") {
        PopUp.$error.style.display = 'block';
      } else if (!!response.type && (response.type === "New Entry" || response.type === "Update")) {
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
      description += PopUp.setProjectBullet(TogglButton.$curEntry.pid, PopUp.$projectBullet);
      PopUp.$editButton.textContent = description;
      PopUp.$editButton.setAttribute('title', 'Click to edit "' + description + '"');
    }
  },

  setProjectBullet: function (pid, elem) {
    var project,
      id = parseInt(pid, 10);
    elem.className = "project-bullet";
    if (!!pid && id !== 0) {
      project = TogglButton.findProjectByPid(id);
      if (!!project) {
        elem.classList.add("color-" + project.color);
        elem.classList.add("project-color");
        return " - " + project.name;
      }
    }
    return "";
  },

  switchView: function (view) {
    PopUp.$menuView.style.display = "none";
    PopUp.$editView.style.display = "none";
    PopUp.$loginView.style.display = "none";
    view.style.display = "block";
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
      togglButtonDescription = document.querySelector("#toggl-button-description"),
      projectSelect,
      placeholder;

    togglButtonDescription.value = (!!TogglButton.$curEntry.description) ? TogglButton.$curEntry.description : "";
    projectSelect = document.getElementById("toggl-button-project");
    projectSelect.value = pid;
    placeholder = document.querySelector("#toggl-button-project-placeholder > .toggl-button-text");
    placeholder.innerHTML = placeholder.title = PopUp.generateLabel(projectSelect, pid, "project");
    PopUp.fetchTasks(pid, tid);
    PopUp.setProjectBullet(pid, document.querySelector("#toggl-button-project-placeholder > .project-bullet"));
    if (!!TogglButton.$curEntry.tags && TogglButton.$curEntry.tags.length) {
      PopUp.setSelecedTags();
    } else {
      document.querySelector("#toggl-button-tag-placeholder > div").innerHTML = "Add tags";
      document.querySelector("#toggl-button-tag").value = "";
    }
    PopUp.switchView(view);
    // Put focus to the beginning of desctiption field
    togglButtonDescription.focus();
    togglButtonDescription.setSelectionRange(0, 0);
    togglButtonDescription.scrollLeft = 0;
  },

  setSelecedTags: function () {
    var j, i,
      s = document.getElementById("toggl-button-tag");
    for (i = 0; i < TogglButton.$curEntry.tags.length; i += 1) {
      for (j = 0; j < s.options.length; j += 1) {
        if (s.options[j].textContent === TogglButton.$curEntry.tags[i]) {
          s.options[j].selected = true;
          i += 1;
          j = 0;
        }
      }
    }

    PopUp.updateTags();
  },

  resetTasks: function () {
    document.querySelector("#toggl-button-task-placeholder").removeEventListener('click', PopUp.delegateTaskClick);
    document.querySelector("#toggl-button-task-placeholder > div").innerHTML = "Add task";
    document.querySelector("#toggl-button-task").innerHTML = "";
  },

  delegateTaskClick: function (e) {
    // Ignore this click if it caused the last task blur.
    if (PopUp.$taskBlurTrigger === e.target) {
      PopUp.$taskBlurTrigger = null;
      return;
    }

    var dropdown = document.getElementById('toggl-button-task'),
      event = document.createEvent('MouseEvents');
    event.initMouseEvent('mousedown', true, true, window);
    dropdown.dispatchEvent(event);
  },

  getSelectedTags: function () {
    var tags = [],
      tag,
      i,
      s = document.getElementById("toggl-button-tag");
    for (i = 0; i < s.options.length; i += 1) {
      if (s.options[i].selected === true) {
        tag = s.options[i].textContent;
        tags.push(tag);
      }
    }
    return tags;
  },

  generateLabel: function (select, id, type) {
    var selected = select.options[select.selectedIndex],
      parent,
      result = "";
    if (parseInt(id, 10) === 0 || !selected) {
      return "Add " + type;
    }
    parent = selected.parentNode;
    if (type === "project" && parent.tagName === "OPTGROUP") {
      result = parent.label + " - ";
    }
    return result + selected.text;
  },

  submitForm: function (that) {
    var taskButton = document.querySelector("#toggl-button-task"),
      selectedProject = document.querySelector("#toggl-button-project"),
      request = {
        type: "update",
        description: document.querySelector("#toggl-button-description").value,
        pid: selectedProject.value,
        projectName: selectedProject.options[selectedProject.selectedIndex].text,
        tags: PopUp.getSelectedTags(),
        tid: (taskButton && taskButton.value) ? taskButton.value : null,
        respond: true,
        service: "dropdown"
      };
    PopUp.sendMessage(request);
    PopUp.closeTagsList(true);
    PopUp.switchView(PopUp.$menuView);
  },

  updateTags: function (open) {
    var tags = PopUp.getSelectedTags(),
      tagsPlaceholder = document.querySelector("#toggl-button-tag-placeholder > div");

    if (open) {
      tagsPlaceholder.innerHTML = tagsPlaceholder.title = "Save tags";
      return;
    }

    if (tags.length) {
      tags = tags.join(',');
    } else {
      tags = "Add tags";
    }
    tagsPlaceholder.innerHTML = tagsPlaceholder.title = tags;
  },

  closeTagsList: function (close) {
    var dropdown = document.getElementById('toggl-button-tag');
    if (close) {
      dropdown.style.display = "none";
      PopUp.$tagsVisible = false;
      return;
    }
    if (PopUp.$tagsVisible) {
      dropdown.style.display = "none";
      PopUp.updateTags();
    } else {
      dropdown.style.display = "block";
      PopUp.updateTags(true);
    }
    PopUp.$tagsVisible = !PopUp.$tagsVisible;
  },

  fetchTasks: function (projectId, tid) {
    var tasksRow = document.getElementById("toggl-button-tasks-row"),
      taskSelect,
      taskPlaceholder;

    PopUp.resetTasks();
    if (!TogglButton.$user.projectTaskList || projectId === 0) {
      tasksRow.style.display = "none";
      return;
    }
    // If tasks are available, populate the task dropdown.
    chrome.extension.sendMessage({type: 'getTasksHtml', projectId: projectId}, function (response) {
      if (response && response.success && response.html) {
        document.querySelector('#toggl-button-task').innerHTML = response.html;
        document.querySelector("#toggl-button-task-placeholder").addEventListener('click', PopUp.delegateTaskClick);
        if (!!tid) {
          taskPlaceholder = document.querySelector("#toggl-button-task-placeholder > div");
          taskSelect = document.getElementById("toggl-button-task");
          taskSelect.value = tid;
          taskPlaceholder.innerHTML = taskPlaceholder.title = PopUp.generateLabel(taskSelect, tid, "task");
        }
        tasksRow.style.display = "block";
      } else {
        tasksRow.style.display = "none";
      }
    });
  },

  addEditEvents: function () {
    /* Edit form events */
    var projectSelect = document.querySelector("#toggl-button-project"),
      taskSelect = document.querySelector("#toggl-button-task"),
      handler;

    handler = function (e) {
      if (!/toggl-button/.test(e.target.className) && !/toggl-button/.test(e.target.parentElement.className)) {
        PopUp.closeTagsList(true);
        this.removeEventListener("click", handler);
      }
    };

    document.querySelector("#toggl-button-update").addEventListener('click', function (e) {
      PopUp.submitForm(this);
    });

    document.querySelector("#entry-form form").addEventListener('submit', function (e) {
      PopUp.submitForm(this);
      e.preventDefault();
    });

    document.addEventListener('mousedown', function (e) {
      PopUp.mousedownTrigger = e.target;
    });
    document.addEventListener('mouseup', function (e) {
      PopUp.mousedownTrigger = null;
    });

    document.querySelector("#toggl-button-project-placeholder").addEventListener('click', function (e) {
      // Ignore this click if it caused the last project blur.
      if (PopUp.projectBlurTrigger === e.target) {
        PopUp.projectBlurTrigger = null;
        return;
      }

      var dropdown = document.getElementById('toggl-button-project'),
        event = document.createEvent('MouseEvents');
      event.initMouseEvent('mousedown', true, true, window);
      dropdown.dispatchEvent(event);
    });

    document.querySelector("#toggl-button-tag-placeholder").addEventListener('click', function (e) {
      PopUp.closeTagsList(false);
    });

    projectSelect.addEventListener('change', function (e) {
      var placeholder = document.querySelector("#toggl-button-project-placeholder > div");
      placeholder.innerHTML = placeholder.title = PopUp.generateLabel(this, this.value, "project");
      PopUp.setProjectBullet(this.value, document.querySelector("#toggl-button-project-placeholder > .project-bullet"));
      // Force blur.
      PopUp.projectBlurTrigger = null;
      projectSelect.blur();

      PopUp.fetchTasks(this.value);
    });

    projectSelect.addEventListener('click', function () {
      // Catch click in case user selects an already-selected item - force blur.
      PopUp.projectBlurTrigger = null;
      projectSelect.blur();
    });

    projectSelect.addEventListener('blur', function () {
      PopUp.projectBlurTrigger = PopUp.mousedownTrigger;
    });

    taskSelect.addEventListener('change', function (e) {
      var taskPlaceholder = document.querySelector("#toggl-button-task-placeholder > div");
      taskPlaceholder.innerHTML = taskPlaceholder.title = (taskSelect.value === "0") ? "Add task" : taskSelect.options[taskSelect.selectedIndex].text;

      // Force blur.
      PopUp.taskBlurTrigger = null;
      taskSelect.blur();
    });

    taskSelect.addEventListener('click', function () {
      // Catch click in case user selects an already-selected item - force blur.
      PopUp.taskBlurTrigger = null;
      projectSelect.blur();
    });

    taskSelect.addEventListener('blur', function (e) {
      PopUp.taskBlurTrigger = PopUp.mousedownTrigger;
    });

    document.addEventListener("click", handler);
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

  document.querySelector(".settings-button").addEventListener('click', function () {
    chrome.runtime.openOptionsPage();
  });

  document.querySelector(".logout-button").addEventListener('click', function () {
    var request = {
      type: "logout",
      respond: true
    };
    PopUp.sendMessage(request);
  });

  document.querySelector(".sync-button").addEventListener('click', function () {
    var request = {
      type: "sync",
      respond: false
    };
    PopUp.sendMessage(request);
    window.close();
  });

  document.querySelector("#signin").addEventListener('submit', function (event) {
    event.preventDefault();
    PopUp.$error.style.display = 'none';
    var request = {
      type: "login",
      respond: true,
      username: document.querySelector("#login_email").value,
      password: document.querySelector("#login_password").value
    };
    PopUp.sendMessage(request);
  });

  document.querySelector(".header").addEventListener('click', function () {
    chrome.tabs.create({url: "https://toggl.com/app"});
  });

  document.querySelector(".user-email").addEventListener('click', function () {
    chrome.tabs.create({url: "https://toggl.com/app/profile"});
  });

});
