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
        description: taskName,
        projectId: selectedProjectId,
        billable: selectedProjectBillable
      });
      link.innerHTML = "Started...";
      return false;
    });
    return link;
  }

  // finds the project's name either directly on the task's details
  // or in navigation bar on top
  function findProjectName(task) {
    // is the project's name in task header?
    var projectNameHolder = task.querySelector('.taskHeader .project a');
    if (projectNameHolder) {
      return projectNameHolder.innerText.toLowerCase();
    } else {
      return '';
    }
  }

  function addButton(e) {
    if (e.target.className === "comments" || iframeRegex.test(e.target.name)) {
      var task = e.target.parentNode.parentNode.parentNode,
          nameHolder = task.querySelector('.name_holder .name'),
          title = nameHolder.innerHTML,
          projectName = findProjectName(task);

      var projectSelect = createProjectSelect(userData, "toggl-select teambox");

      if (projectName) {
        var options = projectSelect.options;

        for (var i = 0; i < options.length; i++) {
          if (options[i].getAttribute('data-project-name') && options[i].getAttribute('data-project-name').toLowerCase() === projectName) {
            options[i].selected = true;
          }
        }
      }

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
