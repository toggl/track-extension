'use strict';

togglbutton.render(
  '.detailViewWithActivityFeedBase .dialog > .header > .flex-auto:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = $('.justify-center.relative > .items-center', elem);

    const getDescription = () => {
      const description = $('.truncate.line-height-3', elem);
      return description ? description.innerText : '';
    };

    const link = togglbutton.createTimerLink({
      className: 'airtable',
      description: getDescription
    });

    container.appendChild(link);
  }
);
