'use strict';

togglbutton.render(
  '[data-id="ticketnumber.fieldControl-text-box-text"]:not(.toggl)',
  { observe: true },
  function (elem) {
    const header = $('#headerContainer');
    const getDescription = function () {
      // entity: incident
      const ticketnumber = $(
        'input[data-id="ticketnumber.fieldControl-text-box-text"]'
      );
      const ticketname = $('input[data-id="title.fieldControl-text-box-text"]');
      if (ticketnumber || ticketname) {
        return (
          (ticketnumber ? ticketnumber.title + ' ' : '') +
          (ticketname ? ticketname.title : '')
        );
      } else {
        // other entities
        if (!header) {
          return '';
        }
        const title = $('h1', header);
        if (!title) {
          return '';
        }
        return title ? title.textContent : '';
      }
    };
    const link = togglbutton.createTimerLink({
      className: 'dynamics365',
      description: getDescription
    });
    header.appendChild(link);
  }
);
