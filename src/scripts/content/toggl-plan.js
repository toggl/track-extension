'use strict';

// Changed from teamweek to Toggl-Plan
// Version active on July 2020
togglbutton.render('.task-form[data-track-inject-button]:not(.toggl)',
  { observe: true },
  element => {
    const container = $('[data-hook=actions-menu]', element);

    const getDescriptionText = () => {
      const titleElement = $('[data-hook=name-editor] textarea', element);
      return titleElement ? titleElement.textContent.trim() : '';
    };

    const getProjectText = () => {
      const planElement = $('[data-hook=plan-editor] [data-hook=input-value]', element);

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
