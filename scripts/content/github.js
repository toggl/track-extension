/*jslint indent: 2 */
/*global window: false, document: false, chrome: false, $: false, createTag: false, createLink: false*/
(function () {
  "use strict";
  var isStarted = false;

  function createTimerLink(task, moreClass) {
    var link = createLink('toggl-button github ' + moreClass);
    link.addEventListener("click", function (e) {
      var msg, btnText;

      if(isStarted) {
        msg = {type: 'stop'};
        btnText = 'Start timer';
      } else {
        msg = {
          type: 'timeEntry',
          description: task
        };
        btnText = 'Started...';
      }
      chrome.extension.sendMessage(msg);
      this.innerHTML = btnText;
      isStarted = !isStarted;
    });
    return link;
  }

  function addLinkToDiscussion() {
    var titleElem = $('.discussion-topic-title'), numElem, title, wrap;
    if (titleElem === null) {
      return;
    }

    numElem = $('.pull-head .pull-number > a, .issue-head .number > strong');
    title = titleElem.innerHTML;
    if (numElem !== null) {
      title = numElem.innerHTML + " " + title;
    }

    wrap = createTag('div', 'toggl infobar-widget');
    wrap.appendChild(createTimerLink(title, 'button minibutton'));
    $(".discusion-topic-infobar").appendChild(wrap);
  }

  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success) {
      addLinkToDiscussion();
    }
  });

}());
