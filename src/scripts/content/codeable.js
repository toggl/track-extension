'use strict';

togglbutton.render('.main__header:not(.toggl)', { observe: true }, function (
  elem
) {
  const description = $('div', elem).textContent;
  const project = $('h3', elem).textContent;

  const link = togglbutton.createTimerLink({
    className: 'codeable',
    description: description,
    projectName: project
  });

  $('.task-developer .body').appendChild(link);
});
