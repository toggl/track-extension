/*jslint indent: 2 */
/*global window: false, document: false, chrome: false, $: false, createTag: false, createLink: false*/
(function () {
  "use strict";
  var isStarted = false;

  function createTimerLink(description, projectName) {
    var link = createLink('toggl-button github');
    link.addEventListener("click", function (e) {
      var msg, btnText, color = '';

      if (isStarted) {
        msg = {type: 'stop'};
        btnText = 'Start timer';
      } else {
        msg = {
          type: 'timeEntry',
          description: description,
          projectName: projectName
        };
        color = '#6cc644';
        btnText = 'Stop timer';
      }
      chrome.extension.sendMessage(msg);
      link.innerHTML = btnText;
      link.style.color = color;
      isStarted = !isStarted;
      return false;
    });

    // new button created - reset state
    isStarted = false;
    return link;
  }

  function addLinkToDiscussion() {
    var title,
      numElem = $('.issue-number'),
      titleElem = $('.js-issue-title'),
      projectElem = $('.js-current-repository');

    if (titleElem === null) {
      return;
    }
    title = titleElem.innerText;
    if (numElem !== null) {
      title = numElem.innerText + " " + title;
    }
    $('.gh-header-meta').appendChild(createTimerLink(title, projectElem && projectElem.textContent));
  }

  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success) {
      addLinkToDiscussion();
    }
  });

}());
