/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.modal-header .content:not(.toggl)',  {observe: true}, function (elem) {

  var link,
    id = $('.modal-header .info .number').textContent,
    description = $('.modal-header .content .title').textContent,
    projectName = $('.repo-icon').getAttribute('title').split('/');

  projectName = projectName[projectName.length - 1];

  link = togglbutton.createTimerLink({
    className: 'overv-io',
    id: id,
    description: description,
    projectName: projectName
  });

  elem.appendChild(link);
});
