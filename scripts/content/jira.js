/*jslint indent: 2 */
/*global window: false, document: false, chrome: false, $: false, createTag: false, createLink: false*/
(function () {
  "use strict";
  function createTimerLink(task, moreClass) {
    var link = createLink('toggl-button jira ' + moreClass);
    link.addEventListener("click", function (e) {
      chrome.extension.sendMessage({
        type: 'timeEntry',
        description: task
      });
      $('span', link).innerHTML = "Started...";
    });
    return link;
  }

  function addLinkToDiscussion() {
    var titleElem = $('#summary-val'), numElem, title, wrapUl, wrapLi, wrapSpan, a;
    if (titleElem === null) {
      return;
    }

    numElem = $('.issue-link');
    title = titleElem.innerHTML;
    if (numElem !== null) {
      title = numElem.getAttribute('data-issue-key') + " " + title;
    }

    wrapUl = createTag('ul', 'toggl toolbar-group');
    wrapLi = createTag('li', 'toolbar-item toggl-button');
    wrapUl.appendChild(wrapLi);

    a = createTimerLink(title, 'button minibutton toolbar-trigger');
    wrapSpan = createTag('span', 'toggl-button', a.textContent);
    a.innerHTML = wrapSpan.outerHTML;
    wrapLi.appendChild(a);
    $(".command-bar .toolbar-split-left").appendChild(wrapUl);
  }

  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success) {
      addLinkToDiscussion();
    }
  });

}());
