'use strict';

togglbutton.render('.comments-number:not(.toggl)', { observe: true }, function (
  elem
) {
  const description = '#' + $('.issue-number').textContent + ' ' + $('.issue-title').textContent;
  const link = togglbutton.createTimerLink({
    className: 'waffle-io',
    description: description
  });

  elem.appendChild(link);
});
