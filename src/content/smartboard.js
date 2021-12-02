'use strict';

togglbutton.render('.task:not(.toggl)', { observe: true }, function (elem) {
  const project = $('#project_name', elem);
  const refElem = $('.task-id', elem);
  const titleElem = $('.task-name', elem);
  const link = togglbutton.createTimerLink({
    className: 'smartboard',
    buttonType: 'minimal',
    description:
      refElem.textContent.trim() + ' ' + titleElem.textContent.trim(),
    projectName: project.value
  });

  $('.toggle-container', elem).appendChild(link);
});
