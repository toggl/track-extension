'use strict';

togglbutton.render(
  '.modal-content .card_container:not(.toggl)',
  { observe: true },
  function (elem) {
    const description = $('.card_container .body a.title', elem).textContent.trim();
    const link = togglbutton.createTimerLink({
      className: 'sprintly',
      description: description
    });

    $('.card_container .card .top', elem).appendChild(link);
  }
);
