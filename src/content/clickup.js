/**
 * @name ClickUp
 * @urlAlias clickup.com
 * @urlRegex *://*.clickup.com/*
 */
'use strict';

function getDescription() {
  const description =  document.querySelector('title').textContent.split('|')[0];
  const taskID = document.querySelector('div[role="dialog"]').getAttribute('data-task-id');

  return `${description} - #${taskID}`;
}

togglbutton.render('#timeTrackingItem:not(.toggl)', { observe: true }, function (
  elem
) {

  function getProject() {
    const project = elem.querySelector('.space-name').textContent;
    return project
  }

  const link = togglbutton.createTimerLink({
    className: 'clickup',
    description: getDescription,
    projectName: getProject,
    buttonType: 'minimal'
  });

  $('.toggl-container').appendChild(link);
});
