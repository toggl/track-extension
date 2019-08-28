'use strict';

togglbutton.render('#timeTrackingItem:not(.toggl)', { observe: true }, function (
  elem
) {
  const description = $('.task-name', elem).textContent;
  const project = $('.space-name', elem).textContent;

  const link = togglbutton.createTimerLink({
    className: 'clickup',
    description: description,
    projectName: project,
    buttonType: 'minimal'
  });

  $('.toggl-container').appendChild(link);
});
