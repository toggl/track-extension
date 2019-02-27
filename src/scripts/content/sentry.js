'use strict';

togglbutton.render('.group-detail:not(.toggl)', { observe: true }, function () {
  const errType = $('h3 > span > span').textContent.trim();
  const detail = $('.message').textContent.trim();
  const project = $('.project-select').textContent.trim();
  const description = errType + ': ' + detail;

  const link = togglbutton.createTimerLink({
    className: 'sentry',
    description: description,
    projectName: project
  });

  $('.group-detail .nav-tabs').appendChild(link);
});
