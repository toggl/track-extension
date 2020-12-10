'use strict';

togglbutton.render('.taskItem-body:not(.toggl)', { observe: true }, function (
  elem
) {
  const container = createTag('a', 'taskItem-toggl');
  const titleElem = $('.taskItem-title', elem);
  const projectTitleElem = $('.taskItemInfo-title', elem);
  const activeList = $('ul.lists .listItem.active');
  const activeListTitle = $('.listItem-title', activeList);

  const projectTitle = projectTitleElem
    ? projectTitleElem.textContent
    : activeListTitle
      ? activeListTitle.textContent
      : '';

  const tagsSelector = () => {
    const tags = elem.querySelectorAll('a.link[href^="/search/%23"]');
    return [...tags].map(tag => tag.textContent.trim().substring(1));
  };

  const link = togglbutton.createTimerLink({
    className: 'microsoft-todo',
    buttonType: 'minimal',
    description: titleElem.textContent,
    projectName: projectTitle,
    tags: tagsSelector
  });

  container.appendChild(link);
  elem.insertBefore(container, elem.lastElementChild);
});
