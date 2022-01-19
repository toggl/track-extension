/**
 * @name Airtable
 * @urlAlias airtable.com
 * @urlRegex *://airtable.com/*
 */
'use strict';

togglbutton.render(
  '.DetailViewWithActivityFeed .detailView .body:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = $('.recordTitle > .relative', elem);

    const getDescription = () => {
      const description = $('h3.recordTitle', elem);
      return description ? description.innerText : '';
    };

    const link = togglbutton.createTimerLink({
      className: 'airtable',
      description: getDescription
    });

    container.appendChild(link);
  }
);
