'use strict';

togglbutton.render(
  '.content-header:not(.toggl)',
  { observe: true },
  function () {
    const id = $('div.content-header-id').textContent;
    const title = $('div.content-header-title').textContent.trim();
    const description = '#' + id + ' ' + title;

    const link = togglbutton.createTimerLink({
      className: 'testrail',
      description: description
    });

    link.setAttribute('style', 'margin-left: 5px');

    $('div.content-header-title').appendChild(link);
  }
);
