'use strict';

togglbutton.render('.task-header .meta:not(.toggl)', {}, function (elem) {
  const description = $('.title h1', elem).textContent.trim();
  let project = $('[data-contexttype="deal"]', elem);

  project = project ? project.textContent.trim() : '';

  const link = togglbutton.createTimerLink({
    className: 'agenocrm',
    description: description,
    projectName: project
  });

  elem.appendChild(link);
});
