'use strict';
/* global togglbutton, $ */

// Ticket
togglbutton.render('.b-ticket:not(.toggl)', { observe: true }, $container => {
  const description = [
    '.b-ticket-info__item.b-ticket-info__item_is_key',
    '.b-ticket__title'
  ]
    .map(selector => $(selector, $container).textContent.trim())
    .join(': ');

  $('.b-ticket-actions__secondary', $container).append(
    togglbutton.createTimerLink({
      className: 'yandex-tracker',
      description
    })
  );
});

// Agile Board
togglbutton.render('.b-agile-task:not(.toggl)', { observe: true }, $container => {
  const description = [
    '.b-agile-task__key',
    '.b-agile-task__title'
  ]
    .map(selector => $(selector, $container).textContent.trim())
    .join(': ');

  $('.b-agile-task__icons', $container).append(
    togglbutton.createTimerLink({
      buttonType: 'minimal',
      className: 'yandex-tracker',
      description
    })
  );
});
