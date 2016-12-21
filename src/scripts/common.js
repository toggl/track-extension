/*jslint indent: 2, unparam: true, plusplus: true*/
/*global AutoComplete: false, ProjectAutoComplete: false, TagAutoComplete: false, document: false, MutationObserver: false, chrome: false, window: false, navigator: false*/
"use strict";

var projectAutocomplete,
  tagAutocomplete;

function $(s, elem) {
  elem = elem || document;
  return elem.querySelector(s);
}

function createTag(name, className, textContent) {
  var tag = document.createElement(name);
  tag.className = className;

  if (textContent) {
    tag.textContent = textContent;
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
  $billable: null,
  isStarted: false,
  element: null,
  links: [],
  serviceName: '',
  projectBlurTrigger: null,
  taskBlurTrigger: null,
  tagsVisible: false,
  hasTasks: false,
  entries: {},
  projects: {},
  user: {},
  duration_format: "",
  currentDescription: "",
  fullPageHeight: getFullPageHeight(),
  fullVersion: "TogglButton",
  render: function (selector, opts, renderer, mutationClass) {
    chrome.runtime.sendMessage({type: 'activate'}, function (response) {
      if (response.success) {
        try {
          togglbutton.user = response.user;
          togglbutton.entries = response.user.time_entries;
          togglbutton.projects = response.user.projectMap;
          togglbutton.fullVersion = response.version;
          togglbutton.duration_format = response.user.duration_format;
          if (opts.observe) {
            var observer = new MutationObserver(function (mutations) {
              // If mutationClass is defined render the start timer link only when this element is changed
              if (!!mutationClass
                  && mutations[0].target.className.indexOf(mutationClass) === -1) {
                return;
              }
              togglbutton.renderTo(selector, renderer);
            });
            observer.observe(document, {childList: true, subtree: true});
          }
          togglbutton.renderTo(selector, renderer);
        } catch (e) {
          chrome.runtime.sendMessage({type: 'error', stack: e.stack, category: 'Content'});
        }
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

  findProjectByPid: function (pid) {
    var key;
    for (key in togglbutton.user.projectMap) {
      if (togglbutton.user.projectMap.hasOwnProperty(key) && togglbutton.user.projectMap[key].id === pid) {
        return togglbutton.user.projectMap[key];
      }
    }
    return undefined;
  },

  updateBillable: function (pid, no_overwrite) {
    var project, i,
      pwid = togglbutton.user.default_wid,
      ws = togglbutton.user.workspaces,
      premium;

    if (pid !== 0) {
      project = togglbutton.findProjectByPid(pid);
      if (!project) {
        return;
      }
      pwid = project.wid;
    }

    for (i = 0; i < ws.length; i++) {
      if (ws[i].id === pwid) {
        premium = ws[i].premium;
        break;
      }
    }

    togglbutton.toggleBillable(premium);

    if (!no_overwrite && project.billable) {
      togglbutton.$billable.classList.toggle("tb-checked", true);
    }
  },

  toggleBillable: function (visible) {
    var tabIndex = visible ? "103" : "-1";
    togglbutton.$billable.setAttribute("tabindex", tabIndex);
    togglbutton.$billable.classList.toggle("no-billable", !visible);
  },

  setupBillable: function (billable, pid) {
    togglbutton.updateBillable(pid, true);
    togglbutton.$billable.classList.toggle("tb-checked", billable);
  },

  addEditForm: function (response) {
    togglbutton.hasTasks = response.hasTasks;
    if (response === null || !response.showPostPopup) {
      return;
    }

    var pid = response.entry.pid,
      tid = response.entry.tid,
      handler,
      closeForm,
      position,
      editFormHeight = 350,
      editFormWidth = 240,
      submitForm,
      elemRect,
      div = document.createElement('div'),
      editForm,
      togglButtonDescription;

    elemRect = togglbutton.element.getBoundingClientRect();
    editForm = $("#toggl-button-edit-form");
    position = togglbutton.topPosition(elemRect, editFormWidth, editFormHeight);

    if (editForm !== null) {
      togglButtonDescription = $("#toggl-button-description");
      togglButtonDescription.value = response.entry.description || "";

      projectAutocomplete.setup(pid, tid);
      tagAutocomplete.setup(response.entry.tags);
      togglbutton.setupBillable(!!response.entry.billable, pid);

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
    editForm.classList.add("toggl-integration");
    document.body.appendChild(editForm);
    togglbutton.$billable = $(".tb-billable", editForm);

    projectAutocomplete = new ProjectAutoComplete("project", "li", togglbutton);
    tagAutocomplete = new TagAutoComplete("tag", "li", togglbutton);

    closeForm = function () {
      projectAutocomplete.closeDropdown();
      tagAutocomplete.closeDropdown();
      editForm.style.display = "none";
    };

    handler = function (e) {
      if (!/toggl-button/.test(e.target.className) && !/toggl-button/.test(e.target.parentElement.className)) {
        closeForm();
        this.removeEventListener("click", handler);
      }
    };

    submitForm = function (that) {
      var selected = projectAutocomplete.getSelected(),
        billable = !!document.querySelector(".tb-billable.tb-checked:not(.no-billable)"),
        request = {
          type: "update",
          description: $("#toggl-button-description").value,
          pid: selected.pid,
          projectName: selected.name,
          tags: tagAutocomplete.getSelected(),
          tid: selected.tid,
          billable: billable,
          service: togglbutton.serviceName
        };
      chrome.runtime.sendMessage(request);
      closeForm();
    };

    // Fill in data if edit form was not present
    togglButtonDescription = $("#toggl-button-description", editForm);
    togglButtonDescription.value = response.entry.description || "";
    setCursorAtBeginning(togglButtonDescription);
    projectAutocomplete.setup(pid, tid);
    tagAutocomplete.setSelected(response.entry.tags);

    togglbutton.setupBillable(!!response.entry.billable, pid);

    // Data fill end
    $("#toggl-button-hide", editForm).addEventListener('click', function (e) {
      closeForm();
    });

    $("#toggl-button-update", editForm).addEventListener('click', function (e) {
      submitForm(this);
    });

    $("#toggl-button-update").addEventListener('keydown', function (e) {
      if (e.code === "Enter" || e.code === "Space") {
        submitForm(this);
      }
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
        link.textContent = 'Start timer';
      }
      chrome.runtime.sendMessage({type: 'stop', respond: true}, togglbutton.addEditForm);
      closeForm();
      return false;
    });

    togglbutton.$billable.addEventListener('click', function () {
      this.classList.toggle("tb-checked");
    });

    togglbutton.$billable.addEventListener('keydown', function (e) {
      var prevent = false;
      if (e.code === "Space") {
        prevent = true;
        this.classList.toggle("tb-checked");
      }

      if (e.code === "ArrowLeft") {
        prevent = true;
        this.classList.toggle("tb-checked", false);
      }

      if (e.code === "ArrowRight") {
        prevent = true;
        this.classList.toggle("tb-checked", true);
      }

      if (prevent) {
        e.stopPropagation();
        e.preventDefault();
      }
    });

    document.addEventListener("click", handler);
  },

  createTimerLink: function (params) {
    var link = createLink('toggl-button');
    togglbutton.currentDescription = invokeIfFunction(params.description);
    togglbutton.currentProject = params.projectName;
    link.title = invokeIfFunction(togglbutton.currentDescription) + (!!invokeIfFunction(togglbutton.currentProject) ? " - " + invokeIfFunction(togglbutton.currentProject) : "");
    if (!!params.calculateTotal) {
      togglbutton.mainDescription = invokeIfFunction(params.description);
    }

    function deactivate() {
      link.classList.remove('active');
      link.style.color = '';
      if (params.buttonType !== 'minimal') {
        link.textContent = 'Start timer';
      }
    }

    function activate() {
      var currentLink = link;
      if (document.querySelector(".toggl-button.active")) {
        link = document.querySelector(".toggl-button.active");
        deactivate();
        link = currentLink;
      }
      link.classList.add('active');
      link.style.color = '#1ab351';
      if (params.buttonType !== 'minimal') {
        link.textContent = 'Stop timer';
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
      e.stopPropagation();
      link = e.target;

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
      chrome.runtime.sendMessage(opts, togglbutton.addEditForm);

      return false;
    });

    // Add created link to links array
    togglbutton.links.push({params: params, link: link});

    // new button created - set state
    chrome.runtime.sendMessage({type: 'currentEntry'}, function (response) {
      var currentEntry, i;
      if (response.success) {
        currentEntry = response.currentEntry;
        for (i = 0;  i < togglbutton.links.length; i++) {
          link = togglbutton.links[i].link;
          if (invokeIfFunction(togglbutton.links[i].params.description)  === currentEntry.description) {
            activate();
          } else {
            deactivate();
          }
        }
      }
    });

    return link;
  },

  // If "entry" is passed, make button active; otherwise inactive.
  updateTimerLink: function (entry) {
    var linkText = '',
      color = '',
      link,
      i,
      minimal;

    if (togglbutton.links.length < 1) {
      return;
    }

    for (i = 0;  i < togglbutton.links.length; i++) {
      link = togglbutton.links[i].link;
      minimal = link.classList.contains("min");

      if (!entry || invokeIfFunction(togglbutton.links[i].params.description) !== entry.description) {
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
      link.textContent = linkText;
    }
  },

  updateTrackedTimerLink: function () {
    var totalTime = $(".toggl-tracked"),
      duration,
      h3,
      p;

    if (!!totalTime) {
      duration = togglbutton.calculateTrackedTime();

      h3 = document.createElement("h3");
      h3.textContent = "Time tracked";

      p = document.createElement("p");
      p.setAttribute("title", "Time tracked with Toggl: " + duration);
      p.textContent = duration;

      totalTime.appendChild(h3);
      totalTime.appendChild(p);
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

chrome.runtime.onMessage.addListener(togglbutton.newMessage);
window.addEventListener('focus', function (e) {
  // update button state
  chrome.runtime.sendMessage({type: 'currentEntry'}, function (response) {
    togglbutton.updateTimerLink(response.currentEntry);
  });
});
