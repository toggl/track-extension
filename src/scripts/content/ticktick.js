'use strict';

togglbutton.render('#task-detail-view:not(.toggl)', { observe: true }, function renderTickTick (elem) {
  function getProject () {
    const projectEl = elem.querySelector('.project-setting input');
    return projectEl ? projectEl.value.trim() : '';
  }

  function getDescription () {
    const descriptionEl = elem.querySelector('.task-title');
    return descriptionEl ? descriptionEl.textContent.trim() : '';
  }

  const button = togglbutton.createTimerLink({
    className: 'TickTick',
    description: getDescription,
    projectName: getProject
  });
  button.style.marginBottom = '15px';

  const root = elem.querySelector('#td-caption');
  if (root) {
    root.insertBefore(button, root.firstChild);
  }
});
