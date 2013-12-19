/*jslint indent: 2 */
/*global document: false, chrome: false, $: false, createLink: false, MutationObserver: false*/

(function () {
  "use strict";
  var selectedProjectId = null, selectedProjectBillable = false, isStarted = false;

  function createTimerLink(task) {
    var link = createLink('toggl-button asana');
    link.addEventListener("click", function (e) {
      var msg, btnText;

      if (isStarted) {
        msg = {type: 'stop'};
        btnText = 'Start timer';
      } else {
        msg = {
          type: 'timeEntry',
          description: task,
          projectId: selectedProjectId,
          billable: selectedProjectBillable
        };
        btnText = 'Started...';
      }
      chrome.extension.sendMessage(msg);
      link.innerHTML = btnText;
      isStarted = !isStarted;
      return false;
    });

    // new button created - reset state
    isStarted = false;

    return link;
  }

  function addButtonTo(elem) {
    var taskDescription = $(".property.description", elem),
      link = createTimerLink($('#details_property_sheet_title', elem).value);
    taskDescription.parentNode.insertBefore(link, taskDescription.nextSibling);
  }

  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success) {
      var observer, elem, i;
      observer = new MutationObserver(function (mutations) {
        var elems = document.querySelectorAll(".details-pane-body:not(.toggl)");
        for (i = 0; i < elems.length; i += 1) {
          elems[i].classList.add('toggl');
        }
        for (i = 0; i < elems.length; i += 1) {
          addButtonTo(elems[i]);
        }
      });
      observer.observe(document.body, {childList: true, subtree: true});
    }
  });

}());
