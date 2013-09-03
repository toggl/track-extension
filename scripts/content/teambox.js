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
    if (e.target.className === "comments" || iframeRegex.test(e.target.name)) {
      var task = e.target.parentNode.parentNode.parentNode,
          nameHolder = task.querySelector('.name_holder .name'),
          title = nameHolder.innerHTML;

      var projectSelect = createProjectSelect(userData, "toggl-select teambox");

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

      nameHolder.parentNode.insertBefore(createTimerLink(title), nameHolder.nextSibling);
      nameHolder.parentNode.insertBefore(projectSelect, nameHolder.nextSibling);
    }
  }

  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success) {
      userData = response.user;
      document.addEventListener("DOMNodeInserted", addButton);
    }
  });

}());
