'use strict';

togglbutton.render(
  '.taskItem-titleWrapper:not(.toggl)',
  { observe: true },
  function (elem) {
    const container = createTag('a', 'taskItem-toggl');
    const listElem = $('.lists-scroll');
    const titleElem = $('.taskItem-titleWrapper-title', elem);
    const projectElem = $('.active', listElem);
    const projectTitleElem = $('.title', projectElem);

    const description = function () {
      return titleElem.textContent;
    };

    const link = togglbutton.createTimerLink({
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
togglbutton.render('.subtask:not(.toggl)', { observe: true }, function (elem) {
  const container = createTag('span', 'detailItem-toggl small');
  const listElem = $('.lists-scroll');
  const chkBxElem = $('.checkBox', elem);
  const titleElem = $('.title-container .display-view');
  const projectElem = $('.active', listElem);
  const projectTitleElem = $('.title', projectElem);
  const taskElem = $('.display-view', elem);

  const description = function () {
    return titleElem.textContent + ' - ' + taskElem.textContent;
  };

  const link = togglbutton.createTimerLink({
    className: 'wunderlist',
    buttonType: 'minimal',
    description: description,
    projectName: projectTitleElem.textContent
  });

  container.appendChild(link);
  chkBxElem.parentNode.insertBefore(container, chkBxElem);
});
