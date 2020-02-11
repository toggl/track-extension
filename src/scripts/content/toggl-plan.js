'use strict';

togglbutton.render('.task-form:not(.toggl)', { observe: true }, elem => {
  const container = $('[data-hook=actions-menu]', elem);

  const getDescriptionText = () => {
    const titleElement = $('[data-hook=name-input]', elem);
    return titleElement ? titleElement.textContent.trim() : '';
  };

  const getProjectText = () => {
    const projectElement = $('[data-hook=project-select] [data-hook=input-label]', elem);
    return projectElement ? projectElement.textContent.trim() : null;
  };

  const link = togglbutton.createTimerLink({
    className: 'teamweek-new',
    buttonType: 'minimal',
    description: getDescriptionText,
    projectName: getProjectText
  });

  container.parentNode.insertBefore(link, container);
});
