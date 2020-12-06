'use strict';

togglbutton.render('#task-detail-view:not(.toggl)', { observe: true }, function renderTickTick (elem) {
  function getProject () {
    const projectEl = $('.project-setting input', elem);
    return projectEl ? projectEl.value.trim() : '';
  }

  function getDescription () {
    const descriptionEl = $('.task-title', elem);
    return descriptionEl ? descriptionEl.textContent.trim() : '';
  }

  const button = togglbutton.createTimerLink({
    className: 'TickTick',
    description: getDescription,
    projectName: getProject
  });
  button.style.marginBottom = '15px';

  const root = $('#td-caption', elem);
  if (root) {
    root.insertBefore(button, root.firstChild);
  }
});
