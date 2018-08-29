'use strict';

// Tickets
togglbutton.render(
  '#ticket_tabs_container #ticket_thread:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      description,
      titleElem = $('.flush-left a'),
      projectElem = $('.tixTitle'),
      ticketNameText = titleElem.textContent.trim(),
      projectNameText = projectElem.textContent.trim();

    description = ticketNameText + ' [' + projectNameText + ']';
    link = togglbutton.createTimerLink({
      className: 'osTicket',
      description: description,
      projectName: projectNameText
    });

    $('.flush-left h2').append(link);
  }
);

// Tasks
togglbutton.render(
  '#task_thread_container #task_thread_content:not(.toggl)',
  {
    observe: true
  },
  function(elem) {
    var link,
      description,
      titleElem = $('.flush-left a'),
      projectElem = $('.tixTitle'),
      ticketNameText = titleElem.textContent.trim(),
      projectNameText = projectElem.textContent.trim();

    description = ticketNameText + ' [' + projectNameText + ']';
    link = togglbutton.createTimerLink({
      className: 'osTicket',
      description: description,
      projectName: projectNameText
    });

    $('.flush-left h2').append(link);
  }
);
