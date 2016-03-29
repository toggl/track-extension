/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

//Board view
togglbutton.render('.board-card:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = $('.panel-body .title', elem).textContent.trim(),
    project = $('#board-header-title .title').textContent.trim().split('/');

  project = project[project.length - 1];

  link = togglbutton.createTimerLink({
    className: 'zube',
    description: description,
    projectName: project,
    buttonType: 'minimal'
  });

  $('.panel-body', elem).insertBefore(link, $('.title', elem));
});


//Detail view
togglbutton.render('#card-modal-view:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = $('#card-title-container .content').textContent.trim(),
    project = $('#board-header-title .title').textContent.trim().split('/');

  project = project[project.length - 1];

  link = togglbutton.createTimerLink({
    className: 'zube',
    description: description,
    projectName: project
  });

  $('.modal-header', elem).insertBefore(link, $('.close', elem));
});
