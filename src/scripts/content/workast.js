'use strict';

function toProperCase(input) {
  return input.replace(/\w\S*/g, function(str) {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  });
}

/* Checklist buttons */
togglbutton.render('a.task-list__item:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    title = $('.item__title', elem).textContent.trim(),
    titleContainer = $('.layout-column', elem),
    subProjectContainer = $(
      '.task-list__title',
      elem.closest('.task-list__container')
    ).firstElementChild,
    taskUndone = $('.task--undone', elem);

  if (!titleContainer || !taskUndone) {
    return;
  }

  // If the current list header is "Open tasks" get the project from the dashboard (current space) title
  var subProject = !subProjectContainer
      ? null
      : subProjectContainer.textContent,
    project =
      subProject === 'Open tasks' || subProject === null
        ? $('.dashboard__title').textContent
        : subProject;

  var tagFunc = function() {
    var tags = [];
    var isDetailedView =
      elem.getElementsByClassName('item__meta--minimize').length > 0;
    if (isDetailedView) {
      var elements = elem.nextElementSibling.getElementsByClassName('tag-item');
      for (
        var i = 0;
        typeof elements[i] != 'undefined';
        tags.push(elements[i++].querySelector('.item-name').textContent)
      );
    } else {
      var elements = elem.getElementsByClassName('item__meta--tag');
      for (
        var i = 0;
        typeof elements[i] != 'undefined';
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

  link = togglbutton.createTimerLink({
    className: 'workast',
    buttonType: 'minimal',
    description: title,
    projectName: project,
    tags: tagFunc
  });

  titleContainer.parentNode.insertBefore(link, titleContainer);
});
