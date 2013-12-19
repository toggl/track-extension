/*jslint indent: 2 */
/*global window: false, document: false, chrome: false, $: false, createTag: false, createLink: false*/
"use strict";

(function () {
  var isStarted = false;

  function showNotice(text) {
    var notice = createTag('div', 'message notice alert');
    notice.appendChild(document.createTextNode(text));
    $('.status').appendChild(notice);
    window.setTimeout(function () {
      notice.parentNode.removeChild(notice);
    }, 2500);
  }

  function addButtonListener(e) {
    var elem = e.relatedNode, cont, btn, link;
    if (elem.classList && (elem.classList.contains("story") || elem.classList.contains("model_details"))) {
      cont = $(".edit aside", elem);

      if ($('.toggl-button', cont)) {
        btn = $('.toggl-button', cont);
        btn.parentNode.removeChild(btn);
      }

      link = createLink('toggl-button pivotal');
      link.addEventListener("click", function (e) {
        var msg, btnText, notice;

        if(isStarted) {
          msg = {type: 'stop'};
          btnText = 'Start timer';
          notice = 'Toggl timer stopped';
        } else {
          msg = {
            type: 'timeEntry',
            description: $("textarea", elem).value
          };
          btnText = 'Started...';
          notice = 'Toggl timer started';
        }
        chrome.extension.sendMessage(msg);
        this.innerHTML = btnText;
        showNotice(notice);
        isStarted = !isStarted;
      });
      cont.appendChild(link);

      // new button created - reset state
      isStarted = false;
    }
  }

  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success) {
      document.addEventListener('DOMNodeInserted', addButtonListener);
    }
  });

}());
