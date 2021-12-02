'use strict';
/* global togglbutton, $ */

// Task list
togglbutton.render(
  '[data-toggl="taskRow"]:not(.toggl)',
  { observe: true },
  $container => {
    const $description = $('[data-toggl="taskRow-name"]', $container);

    const link = togglbutton.createTimerLink({
      className: 'brokerengine',
      description: () => $description.getAttribute('title').trim(),
      buttonType: 'minimal'
    });

    $description.after(link);
  }
);

// Loan view
togglbutton.render(
  '[data-toggl="loanApp"]:not(.toggl)',
  { observe: true },
  $container => {
    const $header = $('[data-toggl="loanHeader"]', $container);

    const link = togglbutton.createTimerLink({
      className: 'brokerengine',
      description: () => $('h1', $header).getAttribute('title').trim()
    });

    $header.append(link);
  }
);

// Loan drawer
togglbutton.render(
  '[data-toggl="loanDrawer"]:not(.toggl)',
  { observe: true },
  $container => {
    const $header = $('[data-toggl="loanHeader"]', $container);

    const link = togglbutton.createTimerLink({
      className: 'brokerengine',
      description: () => $('h1', $header).getAttribute('title').trim()
    });

    $('[data-toggl="loanDrawer-headerCol"]').append(link);
  }
);
