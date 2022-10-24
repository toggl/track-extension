/**
 * @name Airtable
 * @urlAlias airtable.com
 * @urlRegex *://airtable.com/*
 */
'use strict';

togglbutton.render(
  '.DetailViewWithActivityFeed:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = elem.querySelector('div[role="button"]:nth-of-type(5)');

    const getDescription = () => {
      const description = elem.querySelector('.detailView .cellContainer textarea')
      return description ? description.value : '';
    };

    const link = togglbutton.createTimerLink({
      className: 'airtable',
      description: getDescription
    });

    container.after(link);
  }
);
