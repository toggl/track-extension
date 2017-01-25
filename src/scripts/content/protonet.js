/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

// toggl button for todo detail view
togglbutton.render('.todo-details:not(.toggl)', {observe: true}, function (elem) {
  var link,
    title = $('.name', elem).textContent.trim(),
    href = $('.name', elem).getAttribute('href'),
    id = href.split("/").pop(-1),
    description = '#' + id + ': ' + title,
    project = $('ul.breadcrumb li:nth-child(3) a', elem).textContent.trim();

  // check if 'Aufgabenliste' name is an existing project in toggl
  if (togglbutton.findProjectIdByName(project) === undefined) {
    // if not use 'Gruppenname' as project for toggl
    project = $('ul.breadcrumb li:nth-child(1) a', elem).textContent.trim();
  }

  link = togglbutton.createTimerLink({
    className: 'protonet',
    description: description,
    projectName: project
  });

  $('.actions', elem).insertBefore(link, $('.actions', elem).firstChild);
});

// toggl button for group main naviagtion
togglbutton.render('#project-header-intro:not(.toggl)', {observe: true}, function (elem) {
  var link,
    project = $('.project-title .title', elem).textContent.trim(),
    href = $('.project-navigation li:first-child a', elem).getAttribute('href'),
    id = href.split("/").pop(-1),
    description = '';

  // check if 'Gruppenname' is an existing project in toggl
  if (togglbutton.findProjectIdByName(project) === undefined) {
    // if not set description to the group id and title
    description = 'Group #' + id + ' ' + project;
  }

  link = togglbutton.createTimerLink({
    className: 'protonet',
    description: description,
    projectName: project
  });

  $('.project-navigation', elem).appendChild(link);
});