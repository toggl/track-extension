/*jslint indent: 2 */
/*global document: false, chrome: false, $: false, createLink: false, createProjectSelect: false*/

(function () {
  "use strict";
  var iframeRegex = /oauth2relay/, userData = null,
    selectedProjectId = null, selectedProjectBillable = false,
    isStarted = false;

  function createTimerLink(task) {
    var link = createLink('toggl-button asana');
    link.addEventListener("click", function (e) {
      var msg, btnText;

      if(isStarted) {
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

  function addButton(e) {
    if ((e.target.className === "details-pane-redesign" && e.target.id === "right_pane") || iframeRegex.test(e.target.name)) {
      var taskDescription = $(".property.description"),
        title = $("#details_pane_title_row textarea#details_property_sheet_title").value,
        projectSelect = createProjectSelect(userData, "toggl-select asana");

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

      if (!$('.toggl-button', taskDescription.parentNode)) {
        taskDescription.parentNode.insertBefore(createTimerLink(title), taskDescription.nextSibling);
      }
      //taskDescription.parentNode.insertBefore(projectSelect, taskDescription.nextSibling);
    }
  }

  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success) {
      userData = response.user;
      document.addEventListener("DOMNodeInserted", addButton);
    }
  });

}());
