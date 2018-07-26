'use strict';

togglbutton.render('#task-detail-view:not(.toggl)', { observe: true }, function(
  elem
) {
  var text = $('.task-title', elem).textContent,
    project = $('#project-setting input', elem).getAttribute('value'),
    link = togglbutton.createTimerLink({
      className: 'TickTick',
      description: text,
      projectName: project
    });

  $('#tasktitle').appendChild(link);
});
