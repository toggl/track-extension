'use strict';
/* global togglbutton, $ */

// Any.do Q3 2021: task card
togglbutton.render(
  '.TaskEditPaneDetails:not(.toggl)',
  { observe: true },
  elem => {
    const descriptionSelector = () => elem.querySelector('.TaskEditPaneDetails__taskTitle textarea').value;
    const projectSelector = () => elem.querySelector('.TaskCategoryPickerButton__text').textContent;

    const link = togglbutton.createTimerLink({
      buttonType: 'minimal',
      className: 'anydo--2021',
      description: descriptionSelector,
      projectName: projectSelector
    });

    elem.querySelector('.TaskEditPaneDetails__taskLabels').after(link);
  }
);

// Any.do Q3 2021: tasks lists
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
