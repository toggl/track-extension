/*jslint indent: 2 */
/*global window: false, document: false, chrome: false, $: false, createTag: false, createLink: false*/
(function () {
  "use strict";
  function createTimerLink(task, moreClass) {
    var link = createLink('toggl-button gitlab ' + moreClass, 'span');
    link.addEventListener("click", function (e) {
      chrome.extension.sendMessage({
        type: 'timeEntry',
        description: task
      });
      link.innerHTML = "Started...";
      return false;
    });

    // new button created - reset state
    isStarted = false;

    return link;
  }

  function addLinkToDiscussion() {
    var titleElem = $('body.project .ui-box .ui-box-head .box-title'), numElem, title, buttonGroup, wrap;
    if (titleElem === null) {
      return;
    }

    // If button already shown, do nothing
    if( $('.toggl-button.gitlab') !== null ){
      return;
    }

    numElem = $('body.project .page-title');
    title = titleElem.innerHTML;
    if (numElem !== null) {
      title = numElem.firstChild.textContent + " " + title;
    }

    buttonGroup = $("body.project .page-title .pull-right");
    buttonGroup.insertBefore(createTimerLink(title, 'btn grouped'), buttonGroup.firstChild);
  }

  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    // Add event listener to update button when RoR's Turbolink updates the DOM
    document.addEventListener("page:change", function(e) { addLinkToDiscussion(); } );

    if (response.success) {
      addLinkToDiscussion();
    }
  });

}());
