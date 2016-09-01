/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

//Board view
togglbutton.render('.post-it:not(.toggl)', {observe: true}, function (elem) {
  var link,
    description = $('.heading', elem).textContent.trim(),
    project = $('.projects .title').textContent.trim();

  link = togglbutton.createTimerLink({
    className: 'zube',
    description: description,
    projectName: project,
    buttonType: 'minimal'
  });

  $('.heading', elem).insertBefore(link, $('.title', elem));
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

  $('.modal-header', elem).insertBefore(link, $('.number', elem));
});

//Ticket detail view
togglbutton.render('#tickets-title-container:not(.toggl)', {observe: true}, function (elem) {
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
