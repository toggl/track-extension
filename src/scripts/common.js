/*jslint indent: 2, unparam: true, plusplus: true*/
/*global AutoComplete: false, ProjectAutoComplete: false, TagAutoComplete: false, document: false, MutationObserver: false, chrome: false, window: false, navigator: false*/
"use strict";

var projectAutocomplete,
  tagAutocomplete;

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
  links: [],
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
    chrome.runtime.sendMessage({type: 'activate'}, function (response) {
      if (response.success) {
        try {
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
        } catch (e) {
          chrome.runtime.sendMessage({type: 'error', stack: e.stack});
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

  addEditForm: function (response) {
    togglbutton.hasTasks = response.hasTasks;
    if (response === null || !response.showPostPopup) {
      return;
    }

    var pid = response.entry.pid,
      tid = response.entry.tid,
      handler,
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

    projectAutocomplete = new ProjectAutoComplete("project", "li", togglbutton);
    tagAutocomplete = new TagAutoComplete("tag", "li", togglbutton);

    handler = function (e) {
      if (!/toggl-button/.test(e.target.className) && !/toggl-button/.test(e.target.parentElement.className)) {
        editForm.style.display = "none";
        this.removeEventListener("click", handler);
      }
    };

    submitForm = function (that) {
      var selected = projectAutocomplete.getSelected(),
        request = {
          type: "update",
          description: $("#toggl-button-description").value,
          pid: selected.pid,
          projectName: selected.name,
          tags: tagAutocomplete.getSelected(),
          tid: selected.tid,
          service: togglbutton.serviceName
        };
      chrome.runtime.sendMessage(request);
      projectAutocomplete.closeDropdown();
      tagAutocomplete.closeDropdown();
      editForm.style.display = "none";
    };

    // Fill in data if edit form was not present
    togglButtonDescription = $("#toggl-button-description", editForm);
    togglButtonDescription.value = response.entry.description || "";
    setCursorAtBeginning(togglButtonDescription);
    projectAutocomplete.setup(pid, tid);
    tagAutocomplete.setSelected(response.entry.tags);

    // Data fill end
    $("#toggl-button-hide", editForm).addEventListener('click', function (e) {
      projectAutocomplete.closeDropdown();
      tagAutocomplete.closeDropdown();
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
      chrome.runtime.sendMessage({type: 'stop', respond: true}, togglbutton.addEditForm);
      projectAutocomplete.closeDropdown();
      tagAutocomplete.closeDropdown();
      editForm.style.display = "none";
      return false;
    });
    document.addEventListener('mousedown', function (e) {
      togglbutton.mousedownTrigger = e.target;
    });
    document.addEventListener('mouseup', function (e) {
      togglbutton.mousedownTrigger = null;
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
        link.innerHTML = 'Start timer';
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
        link.innerHTML = 'Stop timer';
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
      link.innerHTML = linkText;
    }
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

chrome.runtime.onMessage.addListener(togglbutton.newMessage);
window.addEventListener('focus', function (e) {
  // update button state
  chrome.runtime.sendMessage({type: 'currentEntry'}, function (response) {
    togglbutton.updateTimerLink(response.currentEntry);
  });
});
