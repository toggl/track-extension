/*jslint indent: 2 */
/*global document: false, chrome: false, $: false, createLink: false*/

(function () {
  "use strict";
  var iframeRegex = /oauth2relay/;

  function createTimerLink(task) {
    var link = createLink('toggl-button asana');
    link.addEventListener("click", function (e) {
      chrome.extension.sendMessage({
        type: 'timeEntry',
        description: task
      });
      link.innerHTML = "Started...";
      return false;
    });
    return link;
  }

  function addButton(e) {
    if (e.target.className === "details-pane-redesign" || iframeRegex.test(e.target.name)) {
      var taskDescription = $(".property.description"),
        title = $("#details_pane_title_row textarea#details_property_sheet_title").value;
      taskDescription.parentNode.insertBefore(createTimerLink(title), taskDescription.nextSibling);
    }
  }

  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success) {
      document.addEventListener("DOMNodeInserted", addButton);
    }
  });

}());
