'use strict';

togglbutton.render(
  '#item-title-control:not(.toggl)',
  { observe: true },
  function() {
    var link,
      description = $(
        '.item-detail-page-header__item-title'
      ).textContent.trim(),
      project = $('.nav .dropdown-menu .active').textContent.trim();

    link = togglbutton.createTimerLink({
      className: 'rollbar',
      description: description,
      projectName: project
    });

    $('.item-status-level-area').appendChild(link);
  }
);
