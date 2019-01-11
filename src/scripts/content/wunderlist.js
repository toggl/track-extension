'use strict';

togglbutton.render(
  '.taskItem-titleWrapper:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      container = createTag('a', 'taskItem-toggl'),
      listElem = $('.lists-scroll'),
      titleElem = $('.taskItem-titleWrapper-title', elem),
      projectElem = $('.active', listElem),
      projectTitleElem = $('.title', projectElem),
      description = function() {
        return titleElem.textContent;
      };

    link = togglbutton.createTimerLink({
      className: 'wunderlist',
      buttonType: 'minimal',
      description: description,
      projectName: projectTitleElem.textContent
    });

    container.appendChild(link);
    elem.insertBefore(container, titleElem);
  }
);

/* Checklist buttons */
togglbutton.render('.subtask:not(.toggl)', { observe: true }, function(elem) {
  var link,
    container = createTag('span', 'detailItem-toggl small'),
    listElem = $('.lists-scroll'),
    chkBxElem = $('.checkBox', elem),
    titleElem = $('.title-container .display-view'),
    projectElem = $('.active', listElem),
    projectTitleElem = $('.title', projectElem),
    taskElem = $('.display-view', elem),
    description = function() {
      return titleElem.textContent + ' - ' + taskElem.textContent
    };

  link = togglbutton.createTimerLink({
    className: 'wunderlist',
    buttonType: 'minimal',
    description: description,
    projectName: projectTitleElem.textContent
  });

  container.appendChild(link);
  chkBxElem.parentNode.insertBefore(container, chkBxElem);
});
