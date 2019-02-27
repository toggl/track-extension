'use strict';

togglbutton.render('#task-detail-view:not(.toggl)', { observe: true }, function (
  elem
) {
  const project = $('#project-setting input', elem).getAttribute('value');

  const text = function () {
    return $('.task-title', elem).textContent;
  };

  const link = togglbutton.createTimerLink({
    className: 'TickTick',
    description: text,
    projectName: project
  });

  $('#tasktitle').appendChild(link);
});
