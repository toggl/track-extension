'use strict';

togglbutton.render(
  '.daily .tasks-list .task:not(.toggl), .habit .tasks-list .task:not(.toggl), .todo .tasks-list .task:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      text = $('.task-title', elem).textContent.trim(),
      container = $('.icons-right', elem);

    link = togglbutton.createTimerLink({
      className: 'habitica',
      description: text,
      buttonType: 'minimal'
    });

    container.prepend(link);
  }
);
