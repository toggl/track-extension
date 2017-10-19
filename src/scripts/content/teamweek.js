/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.timeline-task-popup:not(.toggl)', {observe: true}, element => {
  const titleElement = $('[data-hook=input-name]', element);
  const projectNameElement = element;
  const container = $('[data-hook=row-actions]', element);

  if (titleElement === null || container === null) {
    return;
  }

  const link = togglbutton.createTimerLink({
    className: 'teamweek-new',
    buttonType: 'minimal',
    description: () => titleElement.value,
    projectName: () => {
      const projectSelectedElem = $('[name=project_name]', projectNameElement);
      return projectSelectedElem.value || null;
    }
  });

  container.appendChild(link);
});
