'use strict';

togglbutton.render('.toggl-root:not(.toggl)', { observe: true }, function (
  elem
) {
  const integrationClassName = elem.getAttribute('data-class-name');
  const description = elem.getAttribute('data-description');
  const projectName = elem.getAttribute('data-project-name');
  const projectId = elem.getAttribute('data-project-id');
  const tags = elem.getAttribute('data-tags');
  const type = elem.getAttribute('data-type');

  const link = togglbutton.createTimerLink({
    className: integrationClassName || 'dom-integration',
    description: description,
    projectName: projectName,
    projectId: parseInt(projectId, 10),
    tags: tags !== null ? tags.split(',') : [],
    buttonType: type
  });

  elem.appendChild(link);
});
