'use strict';

// Tasks view
togglbutton.render(
  '.liConversationCard:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = elem.querySelector('.card-header-right-section');
    const descriptionElem = elem.querySelector('.task-title');
    const projectElem = elem.querySelector('.card-header-project-name');
    const togglButtonLoc = elem.querySelector('.card-header-visible-icons');

    const link = togglbutton.createTimerLink({
      className: 'corgee',
      description: descriptionElem.textContent.trim(),
      projectName: projectElem && projectElem.textContent.trim(),
      buttonType: 'minimal'
    });

    container.insertBefore(link, togglButtonLoc);
  }
);

// Project tasks view
togglbutton.render(
  '.liConversationTitle:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = elem.querySelector('.task-name-widget');
    const descriptionElem = elem.querySelector('.task-list .task-title');
    const projectElem = document.querySelector('.project-details-name .click-to-edit .lbl-editable-input');

    const link = togglbutton.createTimerLink({
      className: 'corgee-tasks',
      description: descriptionElem.textContent.trim(),
      projectName: projectElem && projectElem.textContent.trim(),
      buttonType: 'minimal'
    });

    container.insertBefore(link, descriptionElem);
  }
);
