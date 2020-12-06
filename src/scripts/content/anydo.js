'use strict';
/* global togglbutton, $ */

// any.do Q4 2018: task card
togglbutton.render('.CardScrollView:not(.toggl)', { observe: true }, elem => {
  const descriptionSelector = () => $('textarea', elem).value;

  const projectSelector = () => $('.TasksToolBarCategoryTitle').textContent;

  const link = togglbutton.createTimerLink({
    buttonType: 'minimal',
    className: 'anydo--2018',
    description: descriptionSelector,
    projectName: projectSelector
  });

  $('textarea', elem).before(link);
});

// Any.do Q4 2018: tasks lists
togglbutton.render(
  '.TaskListRow[draggable=true]:not(.toggl)',
  { observe: true },
  elem => {
    const descriptionSelector = () => $('.TaskItem__label__text__title', elem).textContent;
    const projectSelector = () => $('.TasksToolBarCategoryTitle').textContent;

    const link = togglbutton.createTimerLink({
      buttonType: 'minimal',
      className: 'anydo--2018__taskItem',
      description: descriptionSelector,
      projectName: projectSelector
    });

    $('.TaskItem', elem).appendChild(link);
  }
);
