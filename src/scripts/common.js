/*jslint indent: 2, unparam: true*/
/*global document: false, MutationObserver: false, chrome: false*/
"use strict";

var isStarted = false;

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

  if(!isStarted){
    link.appendChild(document.createTextNode('Start timer'));
  }else{
    link.appendChild(document.createTextNode('Stop timer'));
    link.style.color = '#1ab351';
    link.classList.add('active');
  }
  return link;
}

function invokeIfFunction(trial) {
  if (trial instanceof Function) {
    return trial();
  }
  return trial;
}

var togglbutton = {
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
    if(!isStarted){
       link.classList.add(params.className);
    }

    if (params.buttonType === 'minimal') {
      link.classList.add('min');
      link.removeChild(link.firstChild);
    }

    link.addEventListener('click', function (e) {
      var opts, linkText, color = '';
      e.preventDefault();

      if (isStarted) {
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
      isStarted = !isStarted;
      link.style.color = color;
      if (params.buttonType !== 'minimal') {
        link.innerHTML = linkText;
      }
      return false;
    });

    return link;
  }
};
