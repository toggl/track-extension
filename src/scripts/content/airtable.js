'use strict';

togglbutton.render(
  '.detailViewWithActivityFeedBase .dialog > .header > .flex-auto:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      descFunc,
      container = $('.justify-center.relative > .items-center', elem),
      description = $('.truncate.line-height-3', elem);

    descFunc = function() {
      return !!description ? description.innerText : '';
    };

    link = togglbutton.createTimerLink({
      className: 'airtable',
      description: descFunc
    });

    container.appendChild(link);
  }
);
