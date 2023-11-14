'use strict';
/* global togglbutton, $ */

togglbutton.render(
  '.TaskEditPane header:not(.toggl)',
  { observe: true },
  elem => {
    const descriptionSelector = () => document.querySelector('.TaskEditPaneDetails__taskTitle textarea').value;
    const projectSelector = () => document.querySelector('.TaskEditPane .TaskEditPaneDetails__fullRow:nth-of-type(2) span:nth-of-type(2)').textContent;

    const link = togglbutton.createTimerLink({
      buttonType: 'minimal',
      className: 'anydo--2021',
      description: descriptionSelector,
      projectName: projectSelector
    });

    elem.querySelector('& > div > div').appendChild(link);
  }
);
