'use strict';

togglbutton.render('.toggl-target:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    description = elem.getAttribute('data-descr'),
    project = elem.getAttribute('data-proj');

  link = togglbutton.createTimerLink({
    className: 'husky-marketing-planner',
    description: description,
    projectName: project
  });

  elem.appendChild(link);
});
