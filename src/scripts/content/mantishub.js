/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.page-content .widget-toolbox .pull-left:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = document.querySelector('td.bug-summary').textContent,
    project = document.querySelector('td.bug-project').textContent;

  link = togglbutton.createTimerLink({
    className: 'mantishub',
    description: description,
    projectName: project
  });

  elem.appendChild(link);
});
