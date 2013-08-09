/*jslint indent: 2 */
/*global document: false, chrome: false, $: false, createLink: false, createProjectSelect: false*/

(function () {
  "use strict";
  var iframeRegex = /oauth2relay/, userData = null,
    projectSelect = null;

  function createTimerLink(task) {
    var link = createLink('toggl-button asana');
    link.addEventListener("click", function (e) {
      var projectId = projectSelect.value;

      if (projectId == "default") { return; }

      // Get project to find billable attribute.
      var project = userData.projects.filter(function (elem, index, array) {
        return (elem.id == projectId);
      })[0];

      // If the task description prefix matches a Toggl task, use it.
      var taskDescription = $("#details_pane_title_row textarea#details_property_sheet_title").value;
      var togglTask = userData.tasks.filter(function (elem, index, array) {
        return (elem.pid == projectId && taskDescription.substr(0, elem.name.length) == elem.name);
      })[0];

      chrome.extension.sendMessage({
        type: 'timeEntry',
        billable: project ? project.billable : false,
        description: task,
        projectId: projectId,
        taskId: togglTask ? togglTask.id : null
      });
      link.innerHTML = "Started";
      return false;
    });
    return link;
  }

  function addButton(e) {
    if (!(e.target.className === "details-pane-redesign" || iframeRegex.test(e.target.name))) { return; }

    var taskDescription = $(".property.description"),
      title = $("#details_pane_title_row textarea#details_property_sheet_title").value,
      asanaProject = $(".ancestor-projects > .tag, .property.projects .token_name");

    projectSelect = createProjectSelect(userData, "toggl-select asana", asanaProject ? asanaProject.text : '');

    taskDescription.parentNode.insertBefore(createTimerLink(title), taskDescription.nextSibling);
    taskDescription.parentNode.insertBefore(projectSelect, taskDescription.nextSibling);
  }

  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success) {
      //console.log(response.user);
      userData = response.user;
      document.addEventListener("DOMNodeInserted", addButton);
    }
  });

}());
