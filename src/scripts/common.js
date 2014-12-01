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

var togglbutton = {
  isStarted: false,
  element: null,
  serviceName: '',
  tagsVisible: false,
  render: function (selector, opts, renderer) {
    chrome.extension.sendMessage({type: 'activate'}, function (response) {
      if (response.success) {
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

  getSelectedTags: function () {
    var tags = [],
      tag,
      i,
      s = document.getElementById("toggl-button-tag");
    for (i = 0; i < s.options.length; i += 1) {
      if (s.options[i].selected === true) {
        tag = s.options[i].innerHTML;
        tags.push(tag);
      }
    }
    return tags;
  },

  addEditForm: function (response) {
    if (response === null || !response.showPostPopup) {
      return;
    }
    var pid = (!!response.entry.pid) ? response.entry.pid : 0,
      projectSelect,
      handler,
      left,
      top,
      editFormHeight = 350,
      editFormWidth = 240,
      submitForm,
      updateTags,
      elemRect,
      div = document.createElement('div'),
      editForm;

    elemRect = togglbutton.element.getBoundingClientRect();
    editForm = $("#toggl-button-edit-form");

    if (editForm !== null) {
      $("#toggl-button-description").value = response.entry.description;
      $("#toggl-button-project").value = pid;
      projectSelect = document.getElementById("toggl-button-project");
      $("#toggl-button-project-placeholder > div").innerHTML = (pid === 0) ? "Add project" : projectSelect.options[projectSelect.selectedIndex].text;
      $("#toggl-button-tag").value = "";
      editForm.style.left = (elemRect.left - 10) + "px";
      editForm.style.top = (elemRect.top - 10) + "px";
      editForm.style.display = "block";
      return;
    }

    div.innerHTML = response.html.replace("{service}", togglbutton.serviceName);
    editForm = div.firstChild;
    left = (elemRect.left - 10);
    top = (elemRect.top - 10);
    if (left + editFormWidth > window.innerWidth) {
      left = window.innerWidth - 10 - editFormWidth;
    }
    if (top + editFormHeight > window.innerHeight) {
      top = window.innerHeight - 10 - editFormHeight;
    }
    editForm.style.left = left + "px";
    editForm.style.top = top + "px";
    if (togglbutton.serviceName === "basecamp") {
      editForm.style.position = "fixed";
    }
    document.body.appendChild(editForm);

    handler = function (e) {
      if (!/toggl-button/.test(e.target.className) && !/toggl-button/.test(e.target.parentElement.className)) {
        editForm.style.display = "none";
        this.removeEventListener("click", handler);
      }
    };

    submitForm = function (that) {
      var request = {
        type: "update",
        description: $("#toggl-button-description").value,
        pid: $("#toggl-button-project").value,
        tags: togglbutton.getSelectedTags()
      };
      chrome.extension.sendMessage(request);
      editForm.style.display = "none";
      that.removeEventListener("click", handler);
    };

    updateTags = function () {
      var tags = togglbutton.getSelectedTags();
      if (tags.length) {
        tags = tags.join(',');
      } else {
        tags = "Add tags";
      }
      $("#toggl-button-tag-placeholder > div", editForm).innerHTML = tags;
    };

    $("#toggl-button-description", editForm).value = response.entry.description;
    $("#toggl-button-project", editForm).value = pid;
    projectSelect = $("#toggl-button-project", editForm);
    $("#toggl-button-project-placeholder > div", editForm).innerHTML = (pid === 0) ? "Add project" : projectSelect.options[projectSelect.selectedIndex].text;
    $("#toggl-button-hide", editForm).addEventListener('click', function (e) {
      editForm.style.display = "none";
      this.removeEventListener("click", handler);
    });

    $("#toggl-button-update", editForm).addEventListener('click', function (e) {
      submitForm(this);
    });

    $("form", editForm).addEventListener('submit', function (e) {
      submitForm(this);
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
      chrome.extension.sendMessage({type: 'stop'}, togglbutton.addEditForm);
      editForm.style.display = "none";
      this.removeEventListener("click", handler);
      return false;
    });
    $("#toggl-button-project-placeholder", editForm).addEventListener('click', function (e) {
      var dropdown = document.getElementById('toggl-button-project'),
        event = document.createEvent('MouseEvents');
      event.initMouseEvent('mousedown', true, true, window);
      dropdown.dispatchEvent(event);
      this.removeEventListener("click", handler);
    });

    $("#toggl-button-tag-placeholder", editForm).addEventListener('click', function (e) {
      var dropdown = document.getElementById('toggl-button-tag');
      if (togglbutton.tagsVisible) {
        dropdown.style.display = "none";
        updateTags();
      } else {
        dropdown.style.display = "block";
      }
      togglbutton.tagsVisible = !togglbutton.tagsVisible;

      this.removeEventListener("click", handler);
    });

    $("#toggl-button-project", editForm).addEventListener('change', function (e) {
      projectSelect = $("#toggl-button-project");
      $("#toggl-button-project-placeholder > div", editForm).innerHTML = (projectSelect.value === "0") ? "Add project" : projectSelect.options[projectSelect.selectedIndex].text;

      this.removeEventListener("change", handler);
    });

    document.addEventListener("click", handler);
  },

  createTimerLink: function (params) {
    var link = createLink('toggl-button');
    function activate() {
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
    }

    link.addEventListener('click', function (e) {
      var opts;
      e.preventDefault();

      if (link.classList.contains('active')) {
        deactivate();
        opts = {type: 'stop'};
      } else {
        activate();
        opts = {
          type: 'timeEntry',
          respond: true,
          projectId: invokeIfFunction(params.projectId),
          description: invokeIfFunction(params.description),
          tags: invokeIfFunction(params.tags),
          projectName: invokeIfFunction(params.projectName),
          createdWith: 'TogglButton - ' + params.className
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

  newMessage: function (request, sender, sendResponse) {
    if (request.type === 'stop-entry') {
      var linkText, color = '',
        link = $(".toggl-button");
      if (/active/.test(link.className)) {
        link.classList.remove('active');
        linkText = 'Start timer';
      } else {
        link.classList.add('active');
        color = '#1ab351';
        linkText = 'Stop timer';
      }
      link.style.color = color;
      link.innerHTML = linkText;
    } else if (request.type === 'sync') {
      if ($("#toggl-button-edit-form") !== null) {
        $("#toggl-button-edit-form").remove();
      }
    }
  }
};

chrome.extension.onMessage.addListener(togglbutton.newMessage);
