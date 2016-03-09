/*jslint indent: 2, unparam: true*/
/*global document: false, MutationObserver: false, chrome: false, window: false*/
"use strict";

function $(s, elem) {
  elem = elem || document;
  return elem.querySelector(s);
}

function createTag(name, className, innerHTML) {
  var tag = document.createElement(name);
  tag.className = className;

  if (innerHTML) {
    tag.innerHTML = innerHTML;
  }

  return tag;
}

function createLink(className, tagName, linkHref) {
  var link;

  // Param defaults
  tagName  = tagName  || 'a';
  linkHref = linkHref || '#';
  link     = createTag(tagName, className);

  if (tagName === 'a') {
    link.href = linkHref;
  }

  link.appendChild(document.createTextNode('Start timer'));
  return link;
}

function invokeIfFunction(trial) {
  if (trial instanceof Function) {
    return trial();
  }
  return trial;
}

function getFullPageHeight() {
  var body = document.body,
    html = document.documentElement;

  return Math.max(body.scrollHeight, body.offsetHeight,
                         html.clientHeight, html.scrollHeight, html.offsetHeight);
}

function setCursorAtBeginning(elem) {
  elem.focus();
  elem.setSelectionRange(0, 0);
  elem.scrollLeft = 0;
}

function secondsToTime(duration, format) {
  duration = Math.abs(duration);
  var response,
    seconds = parseInt(duration % 60, 10),
    minutes = parseInt((duration / 60) % 60, 10),
    hours = parseInt((duration / (60 * 60)), 10),
    hoursString = "";

  if (hours > 0) {
    hours = (hours < 10) ? "0" + hours : hours;
    hoursString += hours + "h ";
  }

  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  // Use the format defined in user preferences
  if (format === "improved") {
    response = hours + ":" + minutes + ":" + seconds;
  } else if (format === "decimal") {
    response = hours + "." + parseInt((minutes * 100) / 60, 10) + "h";
  } else {
    response = hoursString + minutes + "m " + seconds + "s";
  }


  return response;
}

var togglbutton = {
  isStarted: false,
  element: null,
  serviceName: '',
  mousedownTrigger: null,
  projectBlurTrigger: null,
  taskBlurTrigger: null,
  tagsVisible: false,
  hasTasks: false,
  entries: {},
  projects: {},
  duration_format: "",
  currentDescription: "",
  fullPageHeight: getFullPageHeight(),
  fullVersion: "TogglButton",
  render: function (selector, opts, renderer) {
    chrome.extension.sendMessage({type: 'activate'}, function (response) {
      if (response.success) {
        togglbutton.entries = response.user.time_entries;
        togglbutton.projects = response.user.projectMap;
        togglbutton.fullVersion = response.version;
        togglbutton.duration_format = response.user.duration_format;
        if (opts.observe) {
          var observer = new MutationObserver(function (mutations) {
            togglbutton.renderTo(selector, renderer);
          });
          observer.observe(document, {childList: true, subtree: true});
        }
        togglbutton.renderTo(selector, renderer);
      }
    });
  },

  renderTo: function (selector, renderer) {
    var i, len, elems = document.querySelectorAll(selector);
    for (i = 0, len = elems.length; i < len; i += 1) {
      elems[i].classList.add('toggl');
    }
    for (i = 0, len = elems.length; i < len; i += 1) {
      renderer(elems[i]);
    }
  },

  topPosition: function (rect, editFormWidth, editFormHeight) {
    var left = (rect.left - 10),
      top = (rect.top + document.body.scrollTop - 10);

    if (left + editFormWidth > window.innerWidth) {
      left = window.innerWidth - 10 - editFormWidth;
    }
    if (top + editFormHeight > togglbutton.fullPageHeight) {
      top = window.innerHeight + document.body.scrollTop - 10 - editFormHeight;
    }
    return {left: left, top: top};
  },

  calculateTrackedTime: function () {
    var duration = 0,
      description = togglbutton.mainDescription.toLowerCase(),
      projectId = togglbutton.findProjectIdByName(togglbutton.currentProject);

    if (!!togglbutton.entries) {
      togglbutton.entries.forEach(function (entry) {
        if (!!entry.description && entry.description.toLowerCase() === description && entry.pid === projectId) {
          duration += entry.duration;
        }
      });
    }

    return secondsToTime(duration, togglbutton.duration_format);
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

  delegateTaskClick: function (e) {
    // Ignore this click if it caused the last task blur.
    if (togglbutton.taskBlurTrigger === e.target) {
      togglbutton.taskBlurTrigger = null;
      return;
    }

    var dropdown = document.getElementById('toggl-button-task'),
      event = document.createEvent('MouseEvents');
    event.initMouseEvent('mousedown', true, true, window);
    dropdown.dispatchEvent(event);
  },


  resetTasks: function () {
    document.querySelector("#toggl-button-task-placeholder").removeEventListener('click', togglbutton.delegateTaskClick);
    document.querySelector("#toggl-button-task-placeholder > div").innerHTML = "Add task";
    document.querySelector("#toggl-button-task").innerHTML = "";
  },

  generateProjectLabel: function (select, pid) {
    var selected = select.options[select.selectedIndex],
      parent,
      result = "";
    if (parseInt(pid, 10) === 0 || !selected) {
      return "Add project";
    }
    parent = selected.parentNode;
    if (parent.tagName === "OPTGROUP") {
      result = parent.label + " - ";
    }
    return result + selected.text;
  },

  addEditForm: function (response) {
    togglbutton.hasTasks = response.hasTasks;
    if (response === null || !response.showPostPopup) {
      return;
    }

    var pid = (!!response.entry.pid) ? response.entry.pid : 0,
      projectSelect,
      placeholder,
      handler,
      position,
      editFormHeight = 350,
      editFormWidth = 240,
      submitForm,
      taskSelect,
      updateTags,
      closeTagsList,
      elemRect,
      div = document.createElement('div'),
      editForm,
      togglButtonDescription;

    elemRect = togglbutton.element.getBoundingClientRect();
    editForm = $("#toggl-button-edit-form");
    position = togglbutton.topPosition(elemRect, editFormWidth, editFormHeight);

    if (editForm !== null) {
      togglbutton.fetchTasks(pid, editForm);
      togglButtonDescription = $("#toggl-button-description");
      togglButtonDescription.value = response.entry.description || "";
      $("#toggl-button-project").value = pid;
      projectSelect = document.getElementById("toggl-button-project");
      placeholder = $("#toggl-button-project-placeholder > div");
      placeholder.innerHTML = placeholder.title = togglbutton.generateProjectLabel(projectSelect, pid);
      togglbutton.resetTasks();
      $("#toggl-button-tag-placeholder > div", editForm).innerHTML = "Add tags";
      $("#toggl-button-tag").value = "";
      editForm.style.left = position.left + "px";
      editForm.style.top = position.top + "px";
      editForm.style.display = "block";
      setCursorAtBeginning(togglButtonDescription);
      return;
    }

    div.innerHTML = response.html.replace("{service}", togglbutton.serviceName);
    editForm = div.firstChild;
    editForm.style.left = position.left + "px";
    editForm.style.top = position.top + "px";
    document.body.appendChild(editForm);
    togglbutton.fetchTasks(pid, editForm);

    handler = function (e) {
      if (!/toggl-button/.test(e.target.className) && !/toggl-button/.test(e.target.parentElement.className)) {
        closeTagsList(true);
        editForm.style.display = "none";
        this.removeEventListener("click", handler);
      }
    };

    submitForm = function (that) {
      var taskButton = $("#toggl-button-task"),
        selectedProject = $("#toggl-button-project"),
        request = {
          type: "update",
          description: $("#toggl-button-description").value,
          pid: selectedProject.value,
          projectName: selectedProject.options[selectedProject.selectedIndex].text,
          tags: togglbutton.getSelectedTags(),
          tid: (taskButton && taskButton.value) ? taskButton.value : null,
          service: togglbutton.serviceName
        };
      chrome.extension.sendMessage(request);
      closeTagsList(true);
      editForm.style.display = "none";
    };

    updateTags = function (open) {
      var tags = togglbutton.getSelectedTags(),
        tagsPlaceholder = $("#toggl-button-tag-placeholder > div", editForm);

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
    };

    closeTagsList = function (close) {
      var dropdown = document.getElementById('toggl-button-tag');
      if (close) {
        dropdown.style.display = "none";
        togglbutton.tagsVisible = false;
        return;
      }
      if (togglbutton.tagsVisible) {
        dropdown.style.display = "none";
        updateTags();
      } else {
        dropdown.style.display = "block";
        updateTags(true);
        dropdown.focus();
      }
      togglbutton.tagsVisible = !togglbutton.tagsVisible;
    };

    togglButtonDescription = $("#toggl-button-description", editForm);
    togglButtonDescription.value = response.entry.description || "";
    setCursorAtBeginning(togglButtonDescription);
    $("#toggl-button-project", editForm).value = pid;
    projectSelect = $("#toggl-button-project", editForm);
    placeholder = $("#toggl-button-project-placeholder > div", editForm);
    placeholder.innerHTML = placeholder.title = togglbutton.generateProjectLabel(projectSelect, pid);
    $("#toggl-button-hide", editForm).addEventListener('click', function (e) {
      closeTagsList(true);
      editForm.style.display = "none";
    });

    $("#toggl-button-update", editForm).addEventListener('click', function (e) {
      submitForm(this);
    });

    $("form", editForm).addEventListener('submit', function (e) {
      submitForm(this);
      e.preventDefault();
    });

    $(".toggl-button", editForm).addEventListener('click', function (e) {
      var link;
      e.preventDefault();
      link = togglbutton.element;
      link.classList.remove('active');
      link.style.color = '';
      if (!link.classList.contains("min")) {
        link.innerHTML = 'Start timer';
      }
      chrome.extension.sendMessage({type: 'stop', respond: true}, togglbutton.addEditForm);
      closeTagsList(true);
      editForm.style.display = "none";
      return false;
    });
    document.addEventListener('mousedown', function (e) {
      togglbutton.mousedownTrigger = e.target;
    });
    document.addEventListener('mouseup', function (e) {
      togglbutton.mousedownTrigger = null;
    });

    $("#toggl-button-project-placeholder", editForm).addEventListener('click', function (e) {
      // Ignore this click if it caused the last project blur.
      if (togglbutton.projectBlurTrigger === e.target) {
        togglbutton.projectBlurTrigger = null;
        return;
      }

      var dropdown = document.getElementById('toggl-button-project'),
        event = document.createEvent('MouseEvents');
      event.initMouseEvent('mousedown', true, true, window);
      dropdown.dispatchEvent(event);
    });

    $("#toggl-button-tag-placeholder", editForm).addEventListener('click', function (e) {
      closeTagsList(false);
    });

    projectSelect.addEventListener('change', function (e) {
      placeholder = $("#toggl-button-project-placeholder > div", editForm);
      placeholder.innerHTML = placeholder.title = togglbutton.generateProjectLabel(this, this.value);

      // Force blur.
      togglbutton.projectBlurTrigger = null;
      projectSelect.blur();

      togglbutton.fetchTasks(this.value, editForm);
    });

    projectSelect.addEventListener('click', function () {
      // Catch click in case user selects an already-selected item - force blur.
      togglbutton.projectBlurTrigger = null;
      projectSelect.blur();
    });

    projectSelect.addEventListener('blur', function () {
      togglbutton.projectBlurTrigger = togglbutton.mousedownTrigger;
    });

    taskSelect = $("#toggl-button-task", editForm);
    taskSelect.addEventListener('change', function (e) {
      var taskPlaceholder = $("#toggl-button-task-placeholder > div", editForm);
      taskPlaceholder.innerHTML = taskPlaceholder.title = (taskSelect.value === "0") ? "Add task" : taskSelect.options[taskSelect.selectedIndex].text;

      // Force blur.
      togglbutton.taskBlurTrigger = null;
      taskSelect.blur();
    });

    taskSelect.addEventListener('click', function () {
      // Catch click in case user selects an already-selected item - force blur.
      togglbutton.taskBlurTrigger = null;
      projectSelect.blur();
    });

    taskSelect.addEventListener('blur', function (e) {
      togglbutton.taskBlurTrigger = togglbutton.mousedownTrigger;
    });

    document.addEventListener("click", handler);
  },

  fetchTasks: function (projectId, editForm) {
    var tasksRow = document.getElementById("toggl-button-tasks-row");
    togglbutton.resetTasks();
    if (!togglbutton.hasTasks || projectId === 0) {
      tasksRow.style.display = "none";
      return;
    }
    // If tasks are available, populate the task dropdown.
    chrome.extension.sendMessage({type: 'getTasksHtml', projectId: projectId}, function (response) {
      if (response && response.success && response.html) {
        $('#toggl-button-task').innerHTML = response.html;
        $("#toggl-button-task-placeholder", editForm).addEventListener('click', togglbutton.delegateTaskClick);
        tasksRow.style.display = "block";
      } else {
        tasksRow.style.display = "none";
      }
    });
  },

  createTimerLink: function (params) {
    var link = createLink('toggl-button');
    togglbutton.currentDescription = params.description;
    togglbutton.currentProject = params.projectName;
    link.title = invokeIfFunction(togglbutton.currentDescription) + (!!invokeIfFunction(togglbutton.currentProject) ? " - " + invokeIfFunction(togglbutton.currentProject) : "");
    if (!!params.calculateTotal) {
      togglbutton.mainDescription = invokeIfFunction(params.description);
    }

    function activate() {
      if (document.querySelector(".toggl-button.active")) {
        document.querySelector(".toggl-button.active").classList.remove('active');
      }
      link.classList.add('active');
      link.style.color = '#1ab351';
      if (params.buttonType !== 'minimal') {
        link.innerHTML = 'Stop timer';
      }
    }

    function deactivate() {
      link.classList.remove('active');
      link.style.color = '';
      if (params.buttonType !== 'minimal') {
        link.innerHTML = 'Start timer';
      }
    }

    link.classList.add(params.className);
    togglbutton.serviceName = params.className;

    if (params.buttonType === 'minimal') {
      link.classList.add('min');
      link.removeChild(link.firstChild);
      link.title = "Start timer: " + link.title;
    }

    link.addEventListener('click', function (e) {
      var opts;
      e.preventDefault();

      if (link.classList.contains('active')) {
        deactivate();
        opts = {
          type: 'stop',
          respond: true,
          service: togglbutton.serviceName
        };
      } else {
        activate();
        opts = {
          type: 'timeEntry',
          respond: true,
          projectId: invokeIfFunction(params.projectId),
          description: invokeIfFunction(params.description),
          tags: invokeIfFunction(params.tags),
          projectName: invokeIfFunction(params.projectName),
          createdWith: togglbutton.fullVersion + "-" + togglbutton.serviceName,
          service: togglbutton.serviceName
        };
      }
      togglbutton.element = e.target;
      chrome.extension.sendMessage(opts, togglbutton.addEditForm);

      return false;
    });

    // new button created - set state
    chrome.extension.sendMessage({type: 'currentEntry'}, function (response) {
      var description, currentEntry;
      if (response.success) {
        currentEntry = response.currentEntry;
        description = invokeIfFunction(params.description);
        if (description === currentEntry.description) {
          activate(link);
        }
      }
    });

    return link;
  },

  // If "entry" is passed, make button active; otherwise inactive.
  updateTimerLink: function (entry) {
    var linkText = '',
      color = '',
      link = $(".toggl-button"),
      minimal;
    if (link === null) {
      return;
    }
    minimal = link.classList.contains("min");

    if (!entry || invokeIfFunction(togglbutton.currentDescription) !== entry.description) {
      link.classList.remove('active');
      if (!minimal) {
        linkText = 'Start timer';
      }
    } else {
      link.classList.add('active');
      color = '#1ab351';
      if (!minimal) {
        linkText = 'Stop timer';
      }
    }
    link.style.color = color;
    link.innerHTML = linkText;
  },

  updateTrackedTimerLink: function () {
    var totalTime = $(".toggl-tracked"),
      duration;

    if (!!totalTime) {
      duration = togglbutton.calculateTrackedTime();
      totalTime.innerHTML = "<h3>Time tracked</h3><p title='Time tracked with Toggl: " + duration + "'>" + duration + "</p>";
    }
  },

  findProjectIdByName: function (name) {
    var key;
    for (key in togglbutton.projects) {
      if (togglbutton.projects.hasOwnProperty(key) && togglbutton.projects[key].name === name) {
        return togglbutton.projects[key].id;
      }
    }
    return undefined;
  },

  newMessage: function (request, sender, sendResponse) {
    if (request.type === 'stop-entry') {
      togglbutton.updateTimerLink();
      togglbutton.entries = request.user.time_entries;
      togglbutton.projects = request.user.projectMap;
      togglbutton.updateTrackedTimerLink();
    } else if (request.type === 'sync') {
      if ($("#toggl-button-edit-form") !== null) {
        $("#toggl-button-edit-form").remove();
      }
    }
  }
};

chrome.extension.onMessage.addListener(togglbutton.newMessage);
window.addEventListener('focus', function (e) {
  // update button state
  chrome.extension.sendMessage({type: 'currentEntry'}, function (response) {
    togglbutton.updateTimerLink(response.currentEntry);
  });
});
