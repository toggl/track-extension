/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.task-header .meta:not(.toggl)', {}, function (elem) {

  var link,
    description = $('.title h1', elem).textContent.trim(),
    project = $('[data-contexttype="deal"]', elem);

  project = project ? project.textContent.trim() : "";

  link = togglbutton.createTimerLink({
    className: 'agenocrm',
    description: description,
    projectName: project
  });

  elem.appendChild(link);
});
