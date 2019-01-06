'use strict';

togglbutton.render('.task-list-item', {}, function(elem) {
  var link,
    description = elem.textContent;

  link = togglbutton.createTimerLink({
    className: 'esa',
    description: description
  });

  elem.appendChild(link);
});
