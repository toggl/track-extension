/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.todo-details:not(.toggl)', {observe: true}, function (elem) {
  var link,
    title = $('.name', elem).textContent.trim(),
    href = $('.name', elem).getAttribute('href'),
    id = href.split("/").pop(-1),
    description = '#' + id + ': ' + title,
    project = $('ul.breadcrumb li:nth-child(3) a', elem).textContent.trim();

  if (togglbutton.findProjectIdByName(project) === undefined) {
    project = $('ul.breadcrumb li:nth-child(1) a', elem).textContent.trim();
  }

  link = togglbutton.createTimerLink({
    className: 'protonet',
    description: description,
    projectName: project
  });

  $('.actions', elem).insertBefore(link, $('.actions', elem).firstChild);
});

togglbutton.render('#project-header-intro:not(.toggl)', {observe: true}, function (elem) {
  var link,
    project = $('.project-title .title', elem).textContent.trim(),
    href = $('.project-navigation li:first-child a', elem).getAttribute('href'),
    id = href.split("/").pop(-1),
    description = '';
  console.log(project, description, togglbutton.findProjectIdByName(project), togglbutton.findProjectIdByName(project) === undefined);
  if (togglbutton.findProjectIdByName(project) === undefined) {
    description = 'Group #' + id + ' ' + project;
  }
  console.log(project, description);

  link = togglbutton.createTimerLink({
    className: 'protonet',
    description: description,
    projectName: project
  });

  $('.project-navigation', elem).appendChild(link);
});