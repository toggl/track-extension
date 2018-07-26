'use strict';

togglbutton.render('.container:not(.toggl)', { observe: true }, function(elem) {
  var link,
    taskTitleElem = $('#title', elem),
    pageTitleElem = $('.content_t', elem),
    description;

  description = '';

  if (pageTitleElem !== null) {
    description += pageTitleElem.textContent.trim();
  }

  if (taskTitleElem !== null) {
    if (description.length > 0) {
      description += ': ';
    }
    description += taskTitleElem.textContent.trim();
  }

  link = togglbutton.createTimerLink({
    className: 'teamleader',
    description: description
  });

  elem.getElementsByClassName('widgettitle')[0].appendChild(link);
});
