'use strict';

togglbutton.render('#timeTrackingItem:not(.toggl)', { observe: true }, function (
  elem
) {

  const description = document.querySelector('title').textContent.split('|')[0];
  const taskID = document.querySelector('title').textContent.split('|')[1];

  const project = elem.querySelector('.space-name').textContent;

  const link = togglbutton.createTimerLink({
    className: 'clickup',
    description: `${description}-#${taskID}`,
    projectName: project,
    buttonType: 'minimal'
  });

  $('.toggl-container').appendChild(link);
});
