/*jslint indent: 2 */
/*global window: false, document: false, chrome: false, $: false, createTag: false, createLink: false*/
"use strict";

(function () {

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
        chrome.extension.sendMessage({
          type: 'timeEntry',
          description: $("textarea", elem).value
        });
        showNotice('Toggl timer started');
      });
      cont.appendChild(link);
    }
  }

  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success) {
      document.addEventListener('DOMNodeInserted', addButtonListener);
    }
  });

}());
