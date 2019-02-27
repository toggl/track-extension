'use strict';

function toProperCase (input) {
  return input.replace(/\w\S*/g, function (str) {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  });
}

/* Checklist buttons */
togglbutton.render('a.task-list__item:not(.toggl)', { observe: true }, function (
  elem
) {
  const title = $('.item__title', elem).textContent.trim();
  const titleContainer = $('.layout-column', elem);

  const subProjectContainer = $(
    '.task-list__title',
    elem.closest('.task-list__container')
  ).firstElementChild;

  const taskUndone = $('.task--undone', elem);

  if (!titleContainer || !taskUndone) {
    return;
  }

  // If the current list header is "Open tasks" get the project from the dashboard (current space) title
  const subProject = !subProjectContainer
    ? null
    : subProjectContainer.textContent;

  let project =
      subProject === 'Open tasks' || subProject === null
        ? $('.dashboard__title').textContent
        : subProject;

  const tagFunc = function () {
    const tags = [];
    const isDetailedView =
      elem.getElementsByClassName('item__meta--minimize').length > 0;
    if (isDetailedView) {
      const elements = elem.nextElementSibling.getElementsByClassName('tag-item');
      for (
        let i = 0;
        typeof elements[i] !== 'undefined';
        tags.push(elements[i++].querySelector('.item-name').textContent)
      );
    } else {
      const elements = elem.getElementsByClassName('item__meta--tag');
      for (
        let i = 0;
        typeof elements[i] !== 'undefined';
        tags.push(elements[i++].getAttribute('aria-label'))
      );
    }
    return tags;
  };

  // Slack channels have a leading #, do not allow spaces, and are all lowercase.
  // Reformat to match typical project names
  project =
    project.charAt(0) === '#'
      ? toProperCase(project.replace(/^#/, '').replace(/[-_]/g, ' '))
      : project;

  const link = togglbutton.createTimerLink({
    className: 'workast',
    buttonType: 'minimal',
    description: title,
    projectName: project,
    tags: tagFunc
  });

  titleContainer.parentNode.insertBefore(link, titleContainer);
});
