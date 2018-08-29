'use strict';

togglbutton.render('.td-attributes:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    newDiv,
    taskActive = $('.task.active'),
    titleElem = $('.title > span', taskActive),
    projectElem = $('.project-value', taskActive);

  if (titleElem === null) {
    return;
  }

  link = togglbutton.createTimerLink({
    className: 'producteev',
    description: titleElem.title,
    projectName: projectElem.title
  });

  newDiv = document.createElement('div');
  elem.insertBefore(newDiv.appendChild(link), elem.firstChild);
});
