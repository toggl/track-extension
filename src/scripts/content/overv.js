'use strict';

togglbutton.render(
  '.modal-header .content:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      description =
        $('.modal-header .info .number').textContent +
        ' ' +
        $('.modal-header .content .title').textContent,
      projectName = $('.repo-icon')
        .getAttribute('title')
        .split('/');

    projectName = projectName[projectName.length - 1];

    link = togglbutton.createTimerLink({
      className: 'overv-io',
      description: description,
      projectName: projectName
    });

    elem.appendChild(link);
  }
);
