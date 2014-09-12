/*jslint indent: 2, unparam: true*/
/*global document: false, MutationObserver: false, chrome: false*/
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
  editHtml: null,
  element: null,
  serviceName: '',
  render: function (selector, opts, renderer) {
    chrome.extension.sendMessage({type: 'activate'}, function (response) {
      if (response.success) {
        togglbutton.editHtml = response.html;
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

  addEditForm: function (response) {
    if (response === null || !response.showPostPopup) {
      return;
    }
    var pid = (!!response.entry.pid) ? response.entry.pid : 0,
      handler,
      elemRect,
      div = document.createElement('div'),
      editForm;

    elemRect = togglbutton.element.getBoundingClientRect();
    editForm = $("#toggl-button-edit-form");
    if (editForm !== null) {
      $("#toggl-button-description").value = response.entry.description;
      $("#toggl-button-project").value = pid;
      editForm.style.left = (elemRect.left - 10) + "px";
      editForm.style.top = (elemRect.top - 10) + "px";
      editForm.style.display = "block";
      return;
    }

    div.innerHTML = togglbutton.editHtml.replace("{service}", togglbutton.serviceName);
    editForm = div.firstChild;

    editForm.style.left = (elemRect.left - 10) + "px";
    editForm.style.top = (elemRect.top - 10) + "px";
    document.body.appendChild(editForm);

    handler = function (e) {
      if (!/toggl-button/.test(e.target.className) && !/toggl-button/.test(e.target.parentElement.className)) {
        editForm.style.display = "none";
        this.removeEventListener("click", handler);
      }
    };

    $("#toggl-button-description", editForm).value = response.entry.description;
    $("#toggl-button-project", editForm).value = pid;
    $("#toggl-button-hide", editForm).addEventListener('click', function (e) {
      editForm.style.display = "none";
      this.removeEventListener("click", handler);
    });

    $("#toggl-button-update", editForm).addEventListener('click', function (e) {
      var request = {
        type: "update",
        description: $("#toggl-button-description").value,
        pid: $("#toggl-button-project").value
      };
      chrome.extension.sendMessage(request);
      editForm.style.display = "none";
      this.removeEventListener("click", handler);
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
    }
  }
};

chrome.extension.onMessage.addListener(togglbutton.newMessage);
