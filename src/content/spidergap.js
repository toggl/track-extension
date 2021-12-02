'use strict';

togglbutton.render(
  '.section-header:not(.toggl)',
  { observe: true },
  function () {
    const description = $('.section-header h1').textContent.trim();
    const project = $('#navbar-project-link').textContent.trim();

    const link = togglbutton.createTimerLink({
      className: 'spidergap',
      description: description,
      projectName: project
    });

    $('.nav-tabs').appendChild(link);
  }
);
