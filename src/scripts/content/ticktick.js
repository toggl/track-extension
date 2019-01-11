'use strict';

togglbutton.render('#task-detail-view:not(.toggl)', { observe: true }, function(
  elem
) {
  var project = $('#project-setting input', elem).getAttribute('value'),
    text = function() {
      return $('.task-title', elem).textContent
    },
    link = togglbutton.createTimerLink({
      className: 'TickTick',
      description: text,
      projectName: project
    });

  $('#tasktitle').appendChild(link);
});
