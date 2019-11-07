'use strict';
/* global togglbutton, $ */

// any.do Q4 2018: task card
togglbutton.render('.CardScrollView:not(.toggl)', { observe: true }, elem => {
  const descriptionElem = $('textarea', elem);

  // Since task popup has same selector as overview
  // do nothing when description is not present
  if (!descriptionElem) {
    return;
  }

  const projectElem = $('.TasksToolBarCategoryTitle');

  const link = togglbutton.createTimerLink({
    buttonType: 'minimal',
    className: 'anydo--2018',
    description: descriptionElem.value,
    projectName: projectElem ? projectElem.textContent : ''
  });

  descriptionElem.before(link);
});

// Any.do Q4 2018: tasks lists
togglbutton.render(
  '.TaskListRow[draggable=true]:not(.toggl)',
  { observe: true },
  elem => {
    const descriptionElem = elem.querySelector('.TaskItem__label__text__title').textContent;
    const projectElem = $('.TasksToolBarCategoryTitle');

    const link = togglbutton.createTimerLink({
      buttonType: 'minimal',
      className: 'anydo--2018__taskItem',
      description: descriptionElem,
      projectName: projectElem ? projectElem.textContent : ''
    });

    const container = $('.TaskItem', elem);
    container.appendChild(link);
  }
);
