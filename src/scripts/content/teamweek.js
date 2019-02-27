'use strict';

togglbutton.render('.timeline-form:not(.toggl)', { observe: true }, function (
  element
) {
  const titleElement = $('[data-hook=input-name]', element);
  const projectElement = $('[name=project_name]', element);
  const container = $('[data-hook=row-actions]', element);

  if (titleElement === null || container === null) {
    return;
  }

  const link = togglbutton.createTimerLink({
    className: 'teamweek-new',
    buttonType: 'minimal',
    description: titleElement.value,
    projectName: projectElement.value || null
  });

  container.appendChild(link);
});
