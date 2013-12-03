/*jslint indent: 2 */
/*global document: false, chrome: false, $: false, createTag: false, createLink: false, MutationObserver: false*/
"use strict";

(function () {

  function addButtonTo(elem) {
    var alink, stag, pill = elem.querySelector('.pill');
    if (pill === null) {
      return;
    }
    alink = createLink('toggl-button');
    alink.style.visibility = 'hidden';
    alink.style.fontSize = '12px';
    alink.style.height = '14px';
    alink.style.lineHeight = '14px';
    alink.style.paddingLeft = '19px';
    alink.style.marginLeft = '3px';
    alink.style.backgroundSize = '17px';
    alink.setAttribute("data-behavior", "hover_content");

    alink.addEventListener("click", function (e) {
      e.preventDefault();
      chrome.extension.sendMessage({
        type: 'timeEntry',
        description: elem.querySelector('.content_for_perma').textContent
      });
    });

    stag = document.createElement("span");
    pill.parentNode.appendChild(stag.appendChild(alink));
  }

  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success) {
      var observer, workspace;

      observer = new MutationObserver(function (mutations) {
        var i, elems = document.querySelectorAll("section.todos li.todo:not(.toggl)");
        for (i = 0; i < elems.length; i += 1) {
          elems[i].classList.add('toggl');
        }

        for (i = 0; i < elems.length; i += 1) {
          addButtonTo(elems[i]);
        }
      });

      workspace = document.querySelector('#workspace');
      observer.observe(workspace, {childList: true, subtree: true});
      // Trigger the mutation observer for initial setup
      setTimeout(workspace.appendChild(document.createElement('a')), 500);
    }
  });

}());
