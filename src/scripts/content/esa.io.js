'use strict';

togglbutton.render('.task-list-item', {}, function (elem) {
  const description = elem.textContent;

  const link = togglbutton.createTimerLink({
    className: 'esa',
    description: description
  });

  elem.appendChild(link);
});
