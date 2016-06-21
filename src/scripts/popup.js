/*jslint indent: 2, unparam: true*/
/*global navigator: false, document: false, window: false, XMLHttpRequest: false, chrome: false, btoa: false, localStorage:false */
"use strict";

var TogglButton = chrome.extension.getBackgroundPage().TogglButton,
  Db = chrome.extension.getBackgroundPage().Db,
  CH = chrome.extension,
  FF = navigator.userAgent.indexOf("Chrome") === -1;

if (FF) {
  CH = chrome.runtime;
  document.querySelector("body").classList.add("ff");
}

var PopUp = {
  $postStartText: " post-start popup",
  $popUpButton: null,
  $togglButton: document.querySelector(".stop-button"),
  $resumeButton: document.querySelector(".resume-button"),
  $errorLabel: document.querySelector(".error"),
  $editButton: document.querySelector(".edit-button"),
  $projectBullet: document.querySelector(".project-bullet"),
  $projectAutocomplete: null,
  $projectFilter: null,
  $projectFilterClear: null,
  projectItems: [],
  lastFilter: null,
  $error: document.querySelector(".error"),
  $timerRow: document.querySelector(".timer"),
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
      document.querySelector(".user-email").textContent = TogglButton.$user.email;
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
      if (PopUp.$menuView.style.display === "none" && PopUp.$editView.style.display === "none") {
        PopUp.switchView(PopUp.$menuView);
      }
    } else {
      localStorage.setItem('latestStoppedEntry', '');
      PopUp.switchView(PopUp.$loginView);
    }
  },

  sendMessage: function (request) {
    CH.sendMessage(request, function (response) {
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
      description += PopUp.setProjectBullet(TogglButton.$curEntry.pid, PopUp.$projectBullet);
      PopUp.$editButton.textContent = description;
      PopUp.$editButton.setAttribute('title', 'Click to edit "' + description + '"');
    }
  },

  updateMenuTimer: function (desc, pid) {
    var description = desc || "(no description)";

    description += PopUp.setProjectBullet(pid, PopUp.$projectBullet);
    PopUp.$editButton.textContent = description;
    PopUp.$editButton.setAttribute('title', 'Click to edit "' + description + '"');
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
      placeholder,
      selected = PopUp.$projectAutocomplete.querySelector(".selected-project");

    togglButtonDescription.value = (!!TogglButton.$curEntry.description) ? TogglButton.$curEntry.description : "";

    if (!!selected) {
      selected.classList.remove("selected-project");
    }
    if (!!pid) {
      PopUp.$projectAutocomplete.querySelector("li[data-pid='" + pid + "']").classList.add("selected-project");
    }

    placeholder = document.querySelector("#toggl-button-project-placeholder > .toggl-button-text");
    placeholder.innerHTML = placeholder.title = PopUp.generateLabel(null, pid, "project");
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
    var selected = false,
      client,
      result = "",
      selectedElem = document.querySelector(".selected-project");

    if (type === "project") {
      if (!!selectedElem) {
        selected = parseInt(selectedElem.getAttribute("data-pid"), 10);
        client = selectedElem.parentNode.querySelector(".client-row");
        if (!!client) {
          result = client.textContent + " - ";
        }
        result += selectedElem.textContent;
      }
    } else {
      selected = select.options[select.selectedIndex];
      result = selected.text;
    }

    if (parseInt(id, 10) === 0 || !selected) {
      return "Add " + type;
    }
    return result;
  },

  submitForm: function (that) {
    var taskButton = document.querySelector("#toggl-button-task"),
      selectedProject = document.querySelector(".selected-project"),
      selectedPid = (!!selectedProject) ? selectedProject.getAttribute("data-pid") : 0,
      selectedProjectName = (!!selectedProject) ? selectedProject.textContent : "",
      request = {
        type: "update",
        description: document.querySelector("#toggl-button-description").value,
        pid: selectedPid,
        projectName: selectedProjectName,
        tags: PopUp.getSelectedTags(),
        tid: (taskButton && taskButton.value) ? taskButton.value : null,
        respond: true,
        service: "dropdown"
      };
    PopUp.sendMessage(request);
    PopUp.closeTagsList(true);
    PopUp.updateMenuTimer(request.description, request.pid);
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
    CH.sendMessage({type: 'getTasksHtml', projectId: projectId}, function (response) {
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
    var taskSelect = document.querySelector("#toggl-button-task"),
      handler;

    PopUp.$projectAutocomplete = document.querySelector("#project-autocomplete");
    PopUp.$projectFilter = document.querySelector("#toggl-button-project-filter");
    PopUp.$projectFilterClear = document.querySelector("#filter-clear");

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
      this.parentNode.classList.toggle("open");
      PopUp.$projectFilter.focus();
    });

    PopUp.$projectFilter.addEventListener('focus', function (e) {
      PopUp.projectItems = document.querySelectorAll("#project-autocomplete li");
    });

    PopUp.$projectFilter.addEventListener('keyup', function (e) {
      var key,
        val = PopUp.$projectFilter.value.toLowerCase(),
        row;

      if (val === PopUp.lastFilter) {
        return;
      }

      if (val.length === 1) {
        PopUp.$projectAutocomplete.classList.add("filtered");
        PopUp.$projectFilterClear.style.display = "block";
      }
      if (val.length === 0) {
        PopUp.$projectAutocomplete.classList.remove("filtered");
        PopUp.$projectFilterClear.style.display = "none";
      }
      PopUp.lastFilter = val;
      for (key in PopUp.projectItems) {
        if (PopUp.projectItems.hasOwnProperty(key)) {
          row = PopUp.projectItems[key];
          if (row.textContent.toLowerCase().indexOf(val) !== -1) {
            row.classList.add("filter");
            if (row.classList.contains("project-row")) {
              row.parentNode.classList.add("filter");
              row.parentNode.parentNode.classList.add("filter");
            }
            if (row.classList.contains("client-row")) {
              row.parentNode.classList.add("filter-match");
            }
          } else if (!!row.classList) {
            row.classList.remove("filter");
            if (row.parentNode.querySelectorAll(".filter").length === 0) {
              row.parentNode.classList.remove("filter");
            }
            if (row.parentNode.parentNode.querySelectorAll(".filter").length === 0) {
              row.parentNode.parentNode.classList.remove("filter");
            }
            if (row.classList.contains("client-row")) {
              row.classList.remove("filter-match");
              row.parentNode.classList.remove("filter-match");
              row.parentNode.parentNode.classList.remove("filter-match");
            }
          }
        }
      }
    });

    PopUp.$projectFilterClear.addEventListener('click', function (e) {
      PopUp.$projectFilter.value = "";
      PopUp.$projectAutocomplete.classList.remove("filtered");
      this.parentNode.classList.toggle("open");
    });

    PopUp.$projectAutocomplete.addEventListener('click', function (e) {
      if (!e.target.classList.contains("project-row")) {
        return;
      }
      var currentSelected = document.querySelector(".selected-project"),
        val = e.target.getAttribute("data-pid"),
        placeholder = document.querySelector("#toggl-button-project-placeholder > div");

      if (!!currentSelected) {
        currentSelected.classList.remove("selected-project");
      }
      e.target.classList.add("selected-project");

      placeholder.innerHTML = placeholder.title = PopUp.generateLabel(this, val, "project");
      PopUp.setProjectBullet(this.value, document.querySelector("#toggl-button-project-placeholder > .project-bullet"));
      PopUp.fetchTasks(val);

      // Close dropdown
      PopUp.$projectFilter.value = "";
      PopUp.$projectAutocomplete.classList.remove("filtered");
      PopUp.$projectFilterClear.parentNode.classList.toggle("open");
    });

    document.querySelector("#toggl-button-tag-placeholder").addEventListener('click', function (e) {
      PopUp.closeTagsList(false);
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
    var request = {
      type: "options",
      respond: false
    };

    CH.sendMessage(request);
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
    PopUp.$errorLabel.classList.remove("show");
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
