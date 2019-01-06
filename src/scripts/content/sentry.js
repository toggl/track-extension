'use strict';

togglbutton.render('.group-detail:not(.toggl)', { observe: true }, function() {
  var link,
    description,
    errType = $('h3 > span > span').textContent.trim(),
    detail = $('.message').textContent.trim(),
    project = $('.project-select').textContent.trim();

  description = errType + ': ' + detail;

  link = togglbutton.createTimerLink({
    className: 'sentry',
    description: description,
    projectName: project
  });

  $('.group-detail .nav-tabs').appendChild(link);
});
