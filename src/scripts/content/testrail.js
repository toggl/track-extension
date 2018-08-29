'use strict';

togglbutton.render(
  '.content-header:not(.toggl)',
  { observe: true },
  function() {
    var link,
      id = $('div.content-header-id').textContent,
      title = $('div.content-header-title').textContent.trim(),
      description = '#' + id + ' ' + title;

    link = togglbutton.createTimerLink({
      className: 'testrail',
      description: description
    });

    link.setAttribute('style', 'margin-left: 5px');

    $('div.content-header-title').appendChild(link);
  }
);
