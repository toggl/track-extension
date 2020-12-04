'use strict';

// Changed from teamweek to Toggl-Plan
// Version active on July 2020
togglbutton.render('.task-form[data-track-inject-button]:not(.toggl)',
  { observe: true },
  element => {
    const container = element.querySelector('[data-hook=actions-menu]');

    const getDescriptionText = () => {
      const titleElement = element.querySelector('[data-hook=name-editor] textarea');
      return titleElement ? titleElement.textContent.trim() : '';
    };

    const getProjectText = () => {
      const planElement = element.querySelector('[data-hook=plan-editor] [data-hook=input-value]');

      return planElement
        ? planElement.textContent.trim()
        : '';
    };

    const link = togglbutton.createTimerLink({
      className: 'toggl-plan',
      buttonType: 'minimal',
      description: getDescriptionText,
      projectName: getProjectText
    });

    container.parentNode.insertBefore(link, container);
  }
);
