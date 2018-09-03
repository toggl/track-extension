/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

// Issue details view
togglbutton.render('[data-toggl-issue] [data-toggl-sidebar]', {observe: true}, function (elem) {
  var li, link, description,
    alias = $('[data-toggl-issue] [data-toggl-alias]').getAttribute('data-toggl-alias'),
    title = ($('[data-toggl-issue] [data-toggl-title]') && $('[data-toggl-issue] [data-toggl-title]').getAttribute('data-toggl-title')) || 'No Title',
    project = $('[data-toggl-issue] [data-toggl-project]') && $('[data-toggl-issue] [data-toggl-project]').getAttribute('data-toggl-project'),
    existingButton = $('.toggl-item', elem);

  description = alias + " - " + title;

  if (!existingButton) {
    link = togglbutton.createTimerLink({className: 'produck', description: description, projectName: project});
    li = document.createElement("li");
    li.classList.add("toggl-item");
    li.appendChild(link);
    elem.prepend(li);
    return;
  }

  // we need to update the description and the project each time the issue gets modified
  if (togglbutton.currentDescription === description && togglbutton.currentProject === project) return;

  togglbutton.currentDescription = description;
  togglbutton.currentProject = project;
  togglbutton.links[0].params.description = description;
  togglbutton.links[0].params.projectName = project;
  togglbutton.links[0].link.title = description + (project ? ' - ' + project : '');

});
