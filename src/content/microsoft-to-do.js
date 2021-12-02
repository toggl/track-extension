'use strict';

togglbutton.render('.taskItem-body:not(.toggl)', { observe: true }, function (
  elem
) {
  const container = createTag('a', 'taskItem-toggl');
  const titleElem = $('.taskItem-title', elem);
  const projectTitleElem = $('.listTitle');
  const activeList = $('.listItem-container.active');
  const activeListTitle = $('.listItem-title', activeList);

  const projectTitle = projectTitleElem
    ? projectTitleElem.textContent
    : activeListTitle
      ? activeListTitle.textContent
      : '';

  const link = togglbutton.createTimerLink({
    className: 'microsoft-todo',
    buttonType: 'minimal',
    description: titleElem.textContent,
    projectName: projectTitle
  });

  container.appendChild(link);
  elem.insertBefore(container, elem.lastElementChild);
});
