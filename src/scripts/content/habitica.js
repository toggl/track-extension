'use strict';

togglbutton.render(
  '.daily .tasks-list .task:not(.toggl), .habit .tasks-list .task:not(.toggl), .todo .tasks-list .task:not(.toggl)',
  { observe: true },
  function (elem) {
    const text = $('.task-title', elem).textContent.trim();
    const container = $('.icons-right', elem);

    const link = togglbutton.createTimerLink({
      className: 'habitica',
      description: text,
      buttonType: 'minimal'
    });

    container.prepend(link);
  }
);
