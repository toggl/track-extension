'use strict';

togglbutton.render('.item-topbar:not(.toggl)', { observe: true }, function (
  elem
) {
  const delay = 1000; // 1 second
  setTimeout(function () {
    const description = $('.item-title', elem);
    const container = $('.breadcrumb', elem);

    if (description === null || container === null) {
      return;
    }

    const link = togglbutton.createTimerLink({
      className: 'podio',
      description: description.textContent.trim()
    });

    const wrapper = createTag('div', 'item-via');
    wrapper.appendChild(link);
    container.parentNode.insertBefore(wrapper, container.nextSibling);
  }, delay);
});

togglbutton.render('.task-detail:not(.toggl)', { observe: true }, function (
  elem
) {
  const description = $('.task-link', elem.parentNode);
  const container = $('.edit-task-reference-wrapper', elem);

  if (description === null || container === null) {
    return;
  }

  const link = togglbutton.createTimerLink({
    className: 'podio',
    description: description.textContent.trim()
  });

  const wrapper = createTag('div', 'task-via');
  wrapper.appendChild(link);
  container.parentNode.insertBefore(wrapper, container.nextSibling);
});

togglbutton.render('.task-header:not(.toggl)', { observe: true }, function (
  elem
) {
  const container = $('.action-bar ul', elem);
  const description = $('.header-title', elem);
  if (description === null || container === null) {
    return;
  }

  const link = togglbutton.createTimerLink({
    className: 'podio',
    description: description.textContent.trim()
  });

  const wrapper = createTag('li', 'float-left');
  wrapper.appendChild(link);
  container.appendChild(wrapper);
});
