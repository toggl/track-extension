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

  // pre-select the right project
  function preselectProject(select, projectName) {
    var options = select.options,
        i, option, tmp, event;

    // first try a match on the project name directly
    for (i = 0; i < options.length; i++) {
      option = options[i];
      if ((tmp = option.getAttribute('data-project-name')) && tmp.toLowerCase() === projectName) {
        option.selected = true;

        // trigger change event
        event = document.createEvent('HTMLEvents');
        event.initEvent('change', false, true);
        select.dispatchEvent(event);
        return;
      }
    }

    // nothing found
    // assume the project name in Teambox equals the client's name in Toggl
    // and try again
    for (i = 0; i < options.length; i++) {
      for (i = 0; i < options.length; i++) {
        option = options[i];
        if ((tmp = option.getAttribute('data-client-name')) && tmp.toLowerCase() === projectName) {
          option.selected = true;
            
          // trigger change event
          event = document.createEvent('HTMLEvents');
          event.initEvent('change', false, true);
          select.dispatchEvent(event);
          return;
        }
      }
    }

  }

  function addButton(e) {
    if (e.target.className === "comments" || iframeRegex.test(e.target.name)) {
      var task = e.target.parentNode.parentNode.parentNode,
          nameHolder = task.querySelector('.name_holder .name'),
          title = nameHolder.innerHTML,
          projectName = findProjectName(task);

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

      if (projectName) {
        preselectProject(projectSelect, projectName);
      }

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
