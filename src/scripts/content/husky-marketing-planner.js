'use strict';

togglbutton.render('.toggl-target:not(.toggl)', { observe: true }, function (
  elem
) {
  const description = elem.getAttribute('data-descr');
  const project = elem.getAttribute('data-proj');

  const link = togglbutton.createTimerLink({
    className: 'husky-marketing-planner',
    description: description,
    projectName: project
  });

  elem.appendChild(link);
});
