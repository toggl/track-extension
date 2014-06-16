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
          projectId: invokeIfFunction(params.projectId),
          description: invokeIfFunction(params.description),
          projectName: invokeIfFunction(params.projectName),
          createdWith: 'TogglButton - ' + params.className
        };
      }
      chrome.extension.sendMessage(opts);
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
