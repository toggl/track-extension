/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

//Listing view
togglbutton.render('.issues .issue:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = $('.subject span.issue-status', elem).textContent.trim(),
    project = $('.switcher-project-name').textContent.trim();

  link = togglbutton.createTimerLink({
    className: 'sifterapp',
    description: description,
    projectName: project
  });

  $('.subject a.issue-status', elem).appendChild(link);
});


//Detail view
togglbutton.render('.issue-detail-subject:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = $('h1', elem).childNodes[0].textContent.trim(),
    project = $('.switcher-project-name').textContent.trim();

  link = togglbutton.createTimerLink({
    className: 'sifterapp',
    description: description,
    projectName: project
  });

  elem.appendChild(link);
});
