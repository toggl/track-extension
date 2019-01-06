'use strict';

// Card detail view
togglbutton.render(
  '#card-modal-view:not(.toggl)',
  { observe: true },
  function() {
    var link,
      description = $('#card-title-container .content').textContent.trim(),
      project = $('.project-name').textContent.trim();

    link = togglbutton.createTimerLink({
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
  function(elem) {
    var link,
      div,
      description = $('.resource-details .title').textContent.trim(),
      project = $('.project-selector .truncate').textContent.trim(),
      existingTag = $('.sidebar-item.toggl');

    if (existingTag) {
      if (existingTag.parentNode.firstChild.classList.contains('toggl')) {
        return;
      }
      existingTag.parentNode.removeChild(existingTag);
    }

    div = document.createElement('div');
    div.classList.add('sidebar-item', 'toggl');

    link = togglbutton.createTimerLink({
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
  function(elem) {
    var link,
      div,
      description = $('.resource-details .title').textContent.trim(),
      project = $('.project-selector .truncate').textContent.trim(),
      existingTag = $('.sidebar-item.toggl');

    if (existingTag) {
      if (existingTag.parentNode.firstChild.classList.contains('toggl')) {
        return;
      }
      existingTag.parentNode.removeChild(existingTag);
    }

    div = document.createElement('div');
    div.classList.add('sidebar-item', 'toggl');

    link = togglbutton.createTimerLink({
      className: 'zube',
      description: description,
      projectName: project
    });

    div.appendChild(link);
    elem.prepend(div);
  }
);
