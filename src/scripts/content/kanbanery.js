'use strict';

togglbutton.render(
  'section.task-actions:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      linkAction = document.createElement('LI'),
      taskTitle = $('p.task-title'),
      firstAction = $('.task-actions ul li:first-child', elem),
      actionList = firstAction.parentNode;

    link = togglbutton.createTimerLink({
      className: 'kanbanery',
      description: taskTitle.textContent
    });

    linkAction.appendChild(link);

    actionList.insertBefore(linkAction, firstAction);
  }
);
