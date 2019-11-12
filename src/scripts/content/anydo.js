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

// Any.do Q4 2018: tasks lists
togglbutton.render(
  '.TaskListRow[draggable=true]:not(.toggl)',
  { observe: true },
  elem => {
    const descriptionSelector = () => elem.querySelector('.TaskItem__label__text__title').textContent;
    const projectSelector = () => document.querySelector('.TasksToolBarCategoryTitle').textContent;

    const link = togglbutton.createTimerLink({
      buttonType: 'minimal',
      className: 'anydo--2018__taskItem',
      description: descriptionSelector,
      projectName: projectSelector
    });

    elem.querySelector('.TaskItem').appendChild(link);
  }
);
