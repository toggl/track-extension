'use strict';

togglbutton.render('.wspace-task-view:not(.toggl)', { observe: true }, function (
  elem
) {
  const container = $('.wrike-panel-header-toolbar', elem);

  const titleElem = function () {
    return $('title').textContent.replace(' - Wrike', '');
  };

  const link = togglbutton.createTimerLink({
    className: 'wrike',
    description: titleElem
  });

  container.insertBefore(link, container.firstChild);
});
