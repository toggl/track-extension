/*jslint indent: 2 */
/*global window: false, document: false, chrome: false, $: false, createTag: false, createLink: false*/

//TODO: the plugin stops working when switching between workspaces...
(function () {
  "use strict";
  function createTimerLink(task, moreClass) {
    var link = createLink('toggl-button asana ' + moreClass);
    link.addEventListener("click", function (e) {
      chrome.extension.sendMessage({
        type: 'timeEntry',
        description: task
      });
      link.innerHTML = "Started...";
    });
    return link;
  }

  function addLinkToDiscussion() {
    var titleElem = $(".details-pane-top .toolbar-section.left"), title, wrap;
    if (titleElem === null) {
      return;
    }

    title = $("#details_pane_title_row textarea#details_property_sheet_title").value;

    wrap = createTag('div', 'toggl infobar-widget');
    wrap.appendChild(createTimerLink(title, 'minibutton'));
    titleElem.appendChild(wrap);
  }

  function sendActivate() {
    chrome.extension.sendMessage({type: 'activate'}, function (response) {
        if (response.success) {
          addLinkToDiscussion();
        }
      });
  }

  function addButton( e ) {
    if (e.target.className === "details-pane-redesign details-pane-footer") {
      if ($(".toggl.infobar-widget") !== null) return; //make sure that we don't add the button twice...
      sendActivate();
    }
  }

  //add the button when loading asana for the first time.
  sendActivate();

  //monitor domNodeInsterted event, as asana updates each task via ajax and some weird LUNA pushstate...
  document.querySelector("#right_pane_container").addEventListener( "DOMNodeInserted", addButton );

}());
