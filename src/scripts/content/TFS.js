/*jslint indent: 2, plusplus: true */
/*global $: false, document: false, togglbutton: false, createTag:false, window: false, MutationObserver: false */

'use strict';

var checkTimer,
  timeWait = 10;

function removeButton(toolbarElement) {
  if (toolbarElement.innerHTML.indexOf('class="toggl-button tfsTogglButton') > -1) {
    var lastNode = toolbarElement.childNodes[0].lastChild;
    if (lastNode.innerHTML.indexOf('timer') > -1) {
      toolbarElement.childNodes[0].removeChild(lastNode);
    }
  }
}

function createTFSEvilHackElement(hackElement, titleHolder) {
  var div = createTag('div', 'empty'),
    a = createTag('a', 'emptylink'),
    where = hackElement,
    title = titleHolder,
    findNew,
    findNewLink;

  if (where.innerHTML.indexOf('class="emptylink"') === -1) {
    where.insertBefore(div, title);
    findNew = where.querySelector('.empty');
    findNew.appendChild(a);
    findNewLink = where.querySelector('.emptylink');
    findNewLink.setAttribute("href", "javascript:void()");
    findNewLink.innerHTML = "&nbsp;";
    findNew.setAttribute("style", "float:left");
  }
}

function createTFSButton(homeElement) {
  var y, link,
    descriptionTitle = "",
    home,
    titleHolder,
    numberPattern,
    toolbars;

  home = homeElement;
  if (home.innerHTML !== "") {
    titleHolder = home.querySelector('.info-text-wrapper');

    numberPattern = /\d+/g;
    descriptionTitle = titleHolder.childNodes[1].innerText + " (TFS Workitem ID: " + titleHolder.childNodes[0].innerText.match(numberPattern) + ")";

    link = togglbutton.createTimerLink({
      className: 'tfsTogglButton',
      description: descriptionTitle
    });

    toolbars = home.parentNode.querySelectorAll('.toolbar');
    if (toolbars.length === 0) {
      toolbars = home.parentNode.parentNode.querySelectorAll('.toolbar');
    }
    for (y = 0; y < toolbars.length; y++) {
      removeButton(toolbars[y]);
      toolbars[y].firstChild.appendChild(link);
    }

    createTFSEvilHackElement(home, titleHolder);
  }

}

var observer = new MutationObserver(function (mutation) {
    var obj = mutation[0].target;
    window.clearTimeout(checkTimer);
    checkTimer = window.setTimeout(function () {
      createTFSButton(obj);
    }, timeWait);
  }),
  config = {
    attributes: true
  };

function createObserver(element) {
  observer.observe(element, config);
}

togglbutton.render('.workitem-info-bar:not(.toggl)', {
  observe: true
}, function () {
  var target = document.querySelectorAll('.workitem-info-bar'),
    y;

  checkTimer = window.setTimeout(function () {
    createTFSButton(target[0]);
  }, timeWait);

  for (y = 0; y < target.length; y++) {
    createObserver(target[y]);
  }

  // observer.disconnect();
});