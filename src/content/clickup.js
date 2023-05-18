'use strict';

togglbutton.render('#timeTrackingItem:not(.toggl)', { observe: true }, function (
  elem
) {
  const description = $('.task-name', elem).textContent;
  const project = $('.space-name', elem).textContent;

  const descriptionParts = description?.split('#')

  const formattedDescription = descriptionParts?.reduce((acc, value, index) => {
    if (index === descriptionParts.length - 1)
      return acc += `#${value.trim()}`
    else
      return acc += `#${value}`
  }, '')

  const link = togglbutton.createTimerLink({
    className: 'clickup',
    description: formattedDescription,
    projectName: project,
    buttonType: 'minimal'
  });

  $('.toggl-container').appendChild(link);
});
