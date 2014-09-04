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
      bodyRect,
      elemRect,
      offsetY,
      offsetX,
      div = document.createElement('div'),
      editForm;
    if (document.querySelector(".toggl-button-edit-form") !== null) {
      document.querySelector("#toggl-button-description").value = response.entry.description;
      document.querySelector("#toggl-button-project").value = pid;
      document.querySelector(".toggl-button-edit-form").style.display = "block";
      return;
    }

    bodyRect = document.body.getBoundingClientRect();
    elemRect = togglbutton.element.getBoundingClientRect();
    offsetY = elemRect.top - bodyRect.top;
    offsetX = elemRect.left - bodyRect.left;
    div.innerHTML = togglbutton.editHtml;
    editForm = div.firstChild;

    editForm.style.left = (offsetX - 10) + "px";
    editForm.style.top = (offsetY - 10) + "px";
    document.body.appendChild(editForm);

    var handler = function(e) {
      if (!/toggl-button/.test(e.target.className) && !/toggl-button/.test(e.target.parentElement.className)) {
        document.querySelector(".toggl-button-edit-form").style.display = "none";
        this.removeEventListener("click", handler);
      }
    }
    editForm.querySelector("#toggl-button-description").value = response.entry.description;
    editForm.querySelector("#toggl-button-project").value = pid;
    editForm.querySelector(".toggl-button-hide").addEventListener('click', function (e) {
      document.querySelector(".toggl-button-edit-form").style.display = "none";
      this.removeEventListener("click", handler);
    });

    editForm.querySelector(".toggl-button-update").addEventListener('click', function (e) {
      var request = {
        type: "update",
        description: document.querySelector("#toggl-button-description").value,
        pid: document.querySelector("#toggl-button-project").value
      };
      chrome.extension.sendMessage(request);
      document.querySelector(".toggl-button-edit-form").style.display = "none";
      this.removeEventListener("click", handler);
    });

    document.addEventListener("click", handler);
  },

  createTimerLink: function (params) {
    var link = createLink('toggl-button');
    link.classList.add(params.className);

    if (params.buttonType === 'minimal') {
      link.classList.add('min');
      link.removeChild(link.firstChild);
    }

    link.addEventListener('click', function (e) {
      var opts, linkText, color = '';
      e.preventDefault();

      if (this.isStarted) {
        link.classList.remove('active');
        linkText = 'Start timer';
        opts = {type: 'stop'};
      } else {
        link.classList.add('active');
        color = '#1ab351';
        linkText = 'Stop timer';
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
      this.isStarted = !this.isStarted;
      link.style.color = color;
      if (params.buttonType !== 'minimal') {
        link.innerHTML = linkText;
      }

      return false;
    });

    // new button created - reset state
    this.isStarted = false;
    return link;
  }
};
