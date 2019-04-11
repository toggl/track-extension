'use strict';

togglbutton.render('.wspace-task-view:not(.toggl)', { observe: true }, function (
  elem
) {
  const container = $('.wrike-panel-header-toolbar', elem);

  const titleElem = function () {
    const wsTaskTitle = document.querySelectorAll('ws-task-title');
    if (wsTaskTitle.length === 1 && wsTaskTitle[0].textContent !== '') {
      return wsTaskTitle[0].textContent;
    }
    return $('title').textContent.replace(' - Wrike', '');
  };

  const link = togglbutton.createTimerLink({
    className: 'wrike',
    description: titleElem
  });

  container.insertBefore(link, container.firstChild);
});
