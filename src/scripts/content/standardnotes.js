'use strict';

/* Simple Task Editor buttons */
togglbutton.render(
  '#open-tasks .task-input-textarea:not(.toggl)',
  { observe: true },
  $container => {
    const link = togglbutton.createTimerLink({
      className: 'standardnotes',
      description: 'test'
    });

    $container.appendChild(link);
  }
);
