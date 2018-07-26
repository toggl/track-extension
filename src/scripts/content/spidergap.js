'use strict';

togglbutton.render(
  '.section-header:not(.toggl)',
  { observe: true },
  function() {
    var link,
      description = $('.section-header h1').textContent.trim(),
      project = $('#navbar-project-link').textContent.trim();

    link = togglbutton.createTimerLink({
      className: 'spidergap',
      description: description,
      projectName: project
    });

    $('.nav-tabs').appendChild(link);
  }
);
