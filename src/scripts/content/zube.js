'use strict';

// Card detail view
togglbutton.render(
  '#card-modal-view:not(.toggl)',
  { observe: true },
  function () {
    const description = $('#card-title-container .content').textContent.trim();
    const project = $('.project-name').textContent.trim();

    const link = togglbutton.createTimerLink({
      className: 'zube',
      description: description,
      projectName: project
    });

    $('#card-primary-attributes-container div').appendChild(link);
  }
);

// Ticket detail view
togglbutton.render(
  '#tickets-show-options-container:not(.toggl)',
  { observe: true },
  function (elem) {
    const description = $('.resource-details .title').textContent.trim();
    const project = $('.project-selector .truncate').textContent.trim();
    const existingTag = $('.sidebar-item.toggl');

    if (existingTag) {
      if (existingTag.parentNode.firstChild.classList.contains('toggl')) {
        return;
      }
      existingTag.parentNode.removeChild(existingTag);
    }

    const div = document.createElement('div');
    div.classList.add('sidebar-item', 'toggl');

    const link = togglbutton.createTimerLink({
      className: 'zube',
      description: description,
      projectName: project
    });

    div.appendChild(link);
    elem.prepend(div);
  }
);

// Epic detail view
togglbutton.render(
  '#epics-show-options-container:not(.toggl)',
  { observe: true },
  function (elem) {
    const description = $('.resource-details .title').textContent.trim();
    const project = $('.project-selector .truncate').textContent.trim();
    const existingTag = $('.sidebar-item.toggl');

    if (existingTag) {
      if (existingTag.parentNode.firstChild.classList.contains('toggl')) {
        return;
      }
      existingTag.parentNode.removeChild(existingTag);
    }

    const div = document.createElement('div');
    div.classList.add('sidebar-item', 'toggl');

    const link = togglbutton.createTimerLink({
      className: 'zube',
      description: description,
      projectName: project
    });

    div.appendChild(link);
    elem.prepend(div);
  }
);
