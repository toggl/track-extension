'use strict';
/* global togglbutton, $ */

// any.do Q4 2018: task card
togglbutton.render('.CardScrollView:not(.toggl)', { observe: true }, elem => {
  const descriptionSelector = () => elem.querySelector('textarea').value;

  const projectSelector = () => document.querySelector('.TasksToolBarCategoryTitle').textContent;

  const link = togglbutton.createTimerLink({
    buttonType: 'minimal',
    className: 'anydo--2018',
    description: descriptionSelector,
    projectName: projectSelector
  });

  elem.querySelector('textarea').before(link);
});

// ny.do Q2 2021: tasks lists
togglbutton.render(
  '.TaskList__taskContainer:not(.toggl)',
  { observe: true },
  elem => {
    const descriptionSelector = () => elem.querySelector('.TaskItem__title').textContent;
    const projectSelector = () => elem.querySelector('.TaskItemIndicators').textContent || document.querySelector('.TasksToolBar__title').textContent;

    const link = togglbutton.createTimerLink({
      buttonType: 'minimal',
      className: 'anydo--2021__taskItem',
      description: descriptionSelector,
      projectName: projectSelector
    });

    elem.querySelector('.TaskItem__mainContent').after(link);
  }
);
