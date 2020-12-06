'use strict';

// Tasks view
togglbutton.render(
  '.liConversationCard:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = $('.card-header-right-section', elem);
    const descriptionElem = $('.task-title', elem);
    const projectElem = $('.card-header-project-name', elem);
    const togglButtonLoc = $('.card-header-visible-icons', elem);

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
    const container = $('.task-name-widget', elem);
    const descriptionElem = $('.task-list .task-title', elem);
    const projectElem = $('.project-details-name .click-to-edit .lbl-editable-input');

    const link = togglbutton.createTimerLink({
      className: 'corgee-tasks',
      description: descriptionElem.textContent.trim(),
      projectName: projectElem && projectElem.textContent.trim(),
      buttonType: 'minimal'
    });

    container.insertBefore(link, descriptionElem);
  }
);
