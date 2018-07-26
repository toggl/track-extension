'use strict';

togglbutton.render('#timeTrackingItem:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    description = $('.task-name', elem).textContent,
    project = $('.space-name', elem).textContent;

  link = togglbutton.createTimerLink({
    className: 'clickup',
    description: description,
    projectName: project,
    buttonType: 'minimal'
  });

  $('.toggl-container').appendChild(link);
});
