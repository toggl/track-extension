/*jslint indent: 2 */
/*global document: false, chrome: false, $: false, createLink: false, createProjectSelect: false*/

(function () {
  "use strict";
  var iframeRegex = /oauth2relay/, userData = null,
    selectedProjectId = null, selectedProjectBillable = false;

  function createTimerLink(taskName) {
    var link = createLink('toggl-button teambox');
    link.addEventListener("click", function (e) {
      chrome.extension.sendMessage({
        type: 'timeEntry',
        description: task,
        projectId: selectedProjectId,
        billable: selectedProjectBillable
      });
      link.innerHTML = "Started...";
      return false;
    });
    return link;
  }

  function addButton(e) {
    if (e.target.className === ".taskName" || iframeRegex.test(e.target.name)) {
      var taskDescription = $(".taskName"),
        title = $("#details_pane_title_row textarea#details_property_sheet_title").value,
        projectSelect = createProjectSelect(userData, "toggl-select teambox");

      //make sure we init the values when switching between tasks
      selectedProjectId = null;
      selectedProjectBillable = false;

      projectSelect.onchange = function (event) {
        selectedProjectId = event.target.options[event.target.selectedIndex].value;
        if (selectedProjectId !== "default") {
          selectedProjectBillable = userData.projects.filter(function (elem, index, array) {
            return (elem.id === selectedProjectId);
          })[0].billable;
        } else {
          selectedProjectId = null;
          selectedProjectBillable = false;
        }
      };

      taskDescription.parentNode.insertBefore(createTimerLink(title), taskDescription.nextSibling);
      taskDescription.parentNode.insertBefore(projectSelect, taskDescription.nextSibling);
    }
  }

  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success) {
      console.log(response.user);
      userData = response.user;
      document.addEventListener("DOMNodeInserted", addButton);
    }
  });

}());
