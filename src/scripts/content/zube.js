/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

//Board view
togglbutton.render('.post-it:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = $('.heading .title', elem).textContent.trim(),
    project = $('.projects .title').textContent.trim(),
    container = $('.heading .title', elem);

  link = togglbutton.createTimerLink({
    className: 'zube',
    description: description,
    projectName: project,
    buttonType: 'minimal'
  });

  container.insertBefore(link, $('.zube-number', elem));
});


//Detail view
togglbutton.render('#card-modal-view:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = $('#card-title-container .content').textContent.trim(),
    project = $('title').textContent.split("|");

  project = project[project.length - 1].trim();

  link = togglbutton.createTimerLink({
    className: 'zube',
    description: description,
    projectName: project,
    buttonType: 'minimal'
  });

  $('.modal-header div', elem).insertBefore(link, $('.number', elem));
});

//Ticket detail view
togglbutton.render('#tickets-show-main-container:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = function () {
      var desc = $('.content', elem);
      if (!!desc) {
        return desc.textContent.trim();
      }

      return "";
    },
    project = $('.projects .title').textContent.trim().split('/');

  project = project[project.length - 1];

  link = togglbutton.createTimerLink({
    className: 'zube',
    description: description,
    projectName: project
  });

  $('#tickets-show-main-container').insertBefore(link, $('#tickets-description-container'));
});
