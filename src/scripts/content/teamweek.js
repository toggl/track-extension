'use strict';

togglbutton.render('.timeline-form:not(.toggl)', { observe: true }, function(
  element
) {
  var titleElement = $('[data-hook=input-name]', element),
    projectElement = $('[name=project_name]', element),
    container = $('[data-hook=row-actions]', element),
    link;

  if (titleElement === null || container === null) {
    return;
  }

  link = togglbutton.createTimerLink({
    className: 'teamweek-new',
    buttonType: 'minimal',
    description: titleElement.value,
    projectName: projectElement.value || null
  });

  container.appendChild(link);
});
