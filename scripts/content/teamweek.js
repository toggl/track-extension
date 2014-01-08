/*jslint indent: 2 */
/*global window: false, document: false, chrome: false, $: false, createTag: false, createLink: false*/
"use strict";

(function () {
  var isStarted = false;

  function showNotice(text) {
    var noticeWrap = createTag('div', 'notification-wrap'),
      notice = createTag('div', 'notification');

    noticeWrap.appendChild(notice);
    notice.appendChild(document.createTextNode(text));
    noticeWrap.style.left = (document.width / 2) - 20 + 'px';

    document.body.appendChild(noticeWrap);
    window.setTimeout(function () {
      noticeWrap.parentNode.removeChild(noticeWrap);
    }, 2500);
  }

  function addButtonListener(e) {
    var popup = $('.event-popup'), link = null;

    if (popup === null || $('.toggl-button', popup) || $('.milestone-edit-form', popup)) {
      return false;
    }

    link = createLink('toggl-button');
    link.addEventListener("click", function (e) {
      var msg, btnText, notice;

      if (isStarted) {
        msg = {type: 'stop'};
        btnText = 'Start timer';
        notice = 'Toggl timer stopped';
      } else {
        msg = {
          type: 'timeEntry',
          pid: $('#toggl-project-id', popup).value,
          description: $('#event-description', popup).value
        };
        btnText = 'Started...';
        notice = 'Toggl timer started';
      }
      chrome.extension.sendMessage(msg);
      this.innerHTML = btnText;
      showNotice(notice);
      isStarted = !isStarted;

      e.preventDefault();
    });

    $('.task_done_buttons', popup).appendChild(link);

    // new button created - reset state
    isStarted = false;
  }

  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success) {
      document.addEventListener('click', addButtonListener);
    }
  });

}());
